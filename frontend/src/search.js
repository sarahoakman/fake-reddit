import { api, main } from './main.js';
import { removeDropdown, smallHeader, largeHeader } from './header.js';
import { resetPage, stylingForAuthUser, formatList, convertTitle } from './helpers.js';
import { setupProfile } from './profile.js';
import { makeFeedPost } from './post.js';
import { setupLogin } from './authenticate.js';

// search.js
	// BONUS
	// functions related to searching through their feed
	// functions related to searching for a user

// event listener after search submitted
	// checks input and gets results
export function setupExplore(explore, input, type, button) {
	button.addEventListener('click', () => {
		// no action if no input is given
		if (input.value == '') {
			return;
		}
		// remove the dropdown search and nav if present
		const header = document.getElementById('small-nav');
		if (header != null) {		
			removeDropdown(header);
		}
		// update the history 
		history.pushState({page: '5', input: input.value, type: type.value}, 'explore', '/#explore?type=' + type.value + '?input=' + input.value);
		// get results and render them 
		setupResults(input.value, type.value);
		// empty the search input
		input.value = '';
	});
}

// renders search results on the page 
export function setupResults(input, type) {
	// go to login page if not logged in 
	if (localStorage.getItem('token') == undefined) {
		setupLogin();
		return;
	}
	document.title = 'Search Results'
	// remove the current webpage 
	resetPage(main);
	// make sure the header is rendered correctly
	if (document.getElementsByTagName('header')[0].id == 'header') {
		stylingForAuthUser()
		smallHeader();
		largeHeader();
	}
	const postContainer = document.createElement('div');
    postContainer.setAttribute('id', 'post-container');
    postContainer.setAttribute('class', 'post-container');
    main.appendChild(postContainer);
		
	// if searching through their feed 
	if (type == 'feed') {
		// get stored list of our feed (constructed for push notifications)
		let temp = localStorage.getItem('followingPosts');
		// if we have no feed, render the message
		if (temp == '' || temp == null) {
			const message = document.createElement('p');
			message.setAttribute('class', 'message center');
			message.innerText = '0 search results 😢. Follow more people!';
			postContainer.appendChild(message);
			return;
		}
		// format local storage into a list 
		temp = formatList(localStorage.getItem('followingPosts'));
		// get a list of posts from their ids
		let posts = Promise.all(temp.map((id) => api.getPostInfo(id)));
		posts
		.then(res => {
			// sort the posts according to published date
			res = res.sort((a,b) => b.meta.published - a.meta.published);
			// check if the search input is in the post description
			// makes a feed post and adds it to the result 
			res.forEach(post => {
				if (post.meta.description_text.toLowerCase().includes(input.toLowerCase())) {
					makeFeedPost(post, false);
				}
			});
			// create a message with the amount of search results
			const message = document.createElement('p');
			message.setAttribute('class', 'message center');
			message.innerText = convertTitle(postContainer.childElementCount, 'search result');
			postContainer.prepend(message);
		})
		.catch(err => console.warn(`ERROR: ${err.message}`));

	}
	// if searching through users
	else {
		// get user by calling the api
		api.getUserByUsername(input)
		.then(res => {
			// no user exists so show message
			if (res.message) {
				const message = document.createElement('p');
				message.setAttribute('class', 'message center');
				message.innerText = '0 search results. Username does not exist 😢';
				postContainer.appendChild(message);
			// user does exist
			} else {
				// create a message
				const message = document.createElement('p');
				message.setAttribute('class', 'message center');
				message.innerText = 'Search returned a user!';
				postContainer.appendChild(message);
				// show the user that is clickable to their profile page
				const user = document.createElement('p');
				user.setAttribute('class', 'users center');
				user.innerText = '👤 ' + res.username;
				postContainer.appendChild(user);
				user.addEventListener('click', () => {
					resetPage(main);
					setupProfile(res.username);
				});
			}
			
		})
		.catch(err => console.warn(`ERROR: ${err.message}`));
	}
}