import API from './api.js';
import { checkFeedUpdates, getFollowingPosts } from './push_notif.js';
import { resetPage, getModal } from './helpers.js';
import { setupLogin, setupRegister } from './authenticate.js';
import { setupFeed } from './feed.js';
import { setupResults } from './search.js';
import { setupProfile } from './profile.js';
import { removeDropdown, smallHeader, largeHeader } from './header.js';

// main.js
	// initialises the api class
	// contains window event listeners for reloading pages and resizing th header
	// intitiates setInterval for push notifications 
	// contains functions related to hash routing 
	// contains functions related to navigating through webpages
	// contains functions for reloading pages


// This url may need to change depending on what port your backend is running
// on.
export const api = new API('http://localhost:5000');

// global main variable for clearing and setting up pages
export const main = document.getElementsByTagName('main')[0];

// event listener: reloads current page
window.addEventListener('load', getPage);

// set interval: check for new posts from people you're following
setInterval(checkFeedUpdates, 1000);

// event listener: handles changes in the url
window.addEventListener('popstate', function (event) {
	resetPage(main);
	// handles changes in url set by history or by going back
	if (event.state) {
		// go to login page or feed 
		if (event.state.page == 1 || event.state.page == 3) {
			setupLogin();
		// go to register page
		} else if (event.state.page == 2) {
			setupRegister();
		// go to search results
		} else if (event.state.page == 5){
			setupResults(event.state.input, event.state.type);
		// go to profile page of current user or other
		} else {
			if (event.state.username == 'me') {
				setupProfile(localStorage.getItem('username'));
			} else {
				setupProfile(event.state.username)
			}
		}
	// handles manual changes in the url 
	} else {
		getPage(event);
	}
});

// helper: gets pages when reloaded or url is manually changed 
	// abstracted into a function for usability across event listeners
function getPage(event) {
	// resets local storage with current posts from all followers
		// used for infinite scroll
	getFollowingPosts();

	const url = decodeURIComponent(event.target.location.href);
	const page = url.split('#')[1];
	// go to login page if / or /#login
	if (page == undefined || page == 'login') {
		setupLogin();
	} else if (page == 'register') {
		setupRegister();
	} else if (page == 'feed') {
		setupFeed();
	} else if (page.includes('profile=')) {
		// get username from url
		const i = page.indexOf('=');
		let user = page.slice(i+1);
		if (user == 'me') {
			user = localStorage.getItem('username')
		}
		setupProfile(user);
	} else if (page.includes('explore')) {
		// get the search input and type of search 
		const split = page.split('?');
		let type = split[1];
		type = type.split('=')[1]
		let input = split[2];
		input = input.split('=')[1]
		setupResults(input, type);
	// creates a modal popup when invalid url is given
	// redirects to login or feed 
	} else {
		getModal('Uh oh! ' + page + ' is not a valid page.', [], 0, null);
		setupLogin();
	}
}

// event listener: toggles between header for small or large screens
window.addEventListener('resize', () => {
	// don't care if not logged in, presents the same header
	if (!localStorage.getItem('token')) {
		return;
	}
	const header = document.getElementsByTagName('header')[0];
	if (document.body.clientWidth <= 830) {
		// render smaller header
		if (header.id == 'large-nav') {
			resetPage(header);
			smallHeader();
		}
	} else {
		// render large header
		if (header.id == 'small-nav') {
			// remove dropdown navigation if open
			removeDropdown(header);
			resetPage(header);
			largeHeader();
		}
	}
});