import { api, main } from './main.js';
import { formatList, getModal, resetPage } from './helpers.js';
import { setupFeed } from './feed.js';
import { setupResults } from './search.js';
import { setupProfile } from './profile.js';

// push_notif.js
	// contains functions for push notification functioning

// function that is called every second for push notifications
export function checkFeedUpdates() {
	// only check when a user is logged in
	if (localStorage.getItem('token')) {
		compareFollowingPosts();
	}
}

// gets all posts from users their following
export function getFollowingPosts() {
	// only check when a user is logged in
	if (localStorage.getItem('token')) {
		// get current users information
		api.getUserById(null)
		.then(res => {
			// sort list of following users numerically
			const following = res.following.sort((a,b) => a - b);
			// store in local storage
			localStorage.setItem('following', following);
			// list of lists: list of posts made by each following user
			const posts = Promise.all(res.following.map(
				id => api.getUserById(id).then(r => r.posts))
			)
			// format the list
			posts
			.then(p => {
				// create a sorted list of integers 
				let allPosts = p.flat();
				allPosts = allPosts.sort((a,b) => a - b);
				// store in local storage
				localStorage.setItem('followingPosts', allPosts);
			})
			.catch(err => console.warn(`ERROR: ${err.message}`));
		})
		.catch(err => console.warn(`ERROR: ${err.message}`));
	}
}

function compareFollowingPosts() {
	// get current userse information
	api.getUserById(null)
	.then(res => {
		// list of lists: list of posts made by each following user
		const posts = Promise.all(res.following.map(
			id => api.getUserById(id).then(r => r.posts))
		)
		posts
		.then(p => {
			// if you have 0 posts in your feed 
			if (p == null) {
				return;
			}
			// format new list of your feed
			let newPosts = p.flat();
			newPosts = newPosts.sort((a,b) => a - b);
			// get old list and format it 
			const oldPosts = formatList(localStorage.getItem('followingPosts'));
			const checkPosts = sameList(newPosts, oldPosts);
			// get a new list of people we are following
			const newFollowing = res.following.sort((a,b) => a - b);
			const oldFollowing = formatList(localStorage.getItem('following'));
			// check if we are following the same people
			const checkFollowing = sameList(newFollowing, oldFollowing);
			// get any existing modals
			const modal = document.getElementById('push-notif-posts');
			// check if there are new posts, no current notifications and no new followers
				// check for followers since new followers may undesirably trigger it
			if (!checkPosts && checkFollowing) {
				// get the post that was added
				const addedPost = getDifference(newPosts, oldPosts)
				// get the post information
				api.getPostInfo(addedPost)
				.then(user => {
					// live update the feed if on the page
					if (document.title == 'Feed') {
						resetPage(main);
						setupFeed();
					}
					if (document.title == 'Search Results') {
						resetPage(main);
						renderResults();
					}
					if (document.title.includes('Profile')) {
						renderProfile(user.meta.author);
					}
					if (!modal) {
						// create notification 
						const message = "Hooray 😀, someone you're following (" + user.meta.author + ") made a post!";
						const modalObject = getModal(message, [], 0, null);
						modalObject.modal.setAttribute('id', 'push-notif-posts');
					}
					
				})
				.catch(err => console.warn(`ERROR: ${err.message}`));
			}
			// update local storage
			localStorage.setItem('followingPosts', newPosts);
			localStorage.setItem('following', newFollowing);
		})
		.catch(err => console.warn(`ERROR: ${err.message}`));
	})
	.catch(err => console.warn(`ERROR: ${err.message}`));
}

// helper: checks if 2 lists are the same
function sameList(list1, list2) {
	if (list1.length != list2.length) {
		return false;
	}
	for(let i = 0; i < list1.length; i++) {
		if (list1[i] != list2[i]) {
			return false
		}
	}
	return true;
}

// helper: gets the new post id from the new list of posts
function getDifference(list1, list2) {
	for(let i = 0; i < list1.length; i++) {
		if (list1[i] != list2[i]) {
			return list1[i]
		}
	}
}

// helper: re-renders the search result page
function renderResults() {
	const url = decodeURIComponent(window.location.href);
	const page = url.split('#')[1];
	// get the search input and type of search 
	const split = page.split('?');
	let type = split[1];
	type = type.split('=')[1]
	let input = split[2];
	input = input.split('=')[1]
	setupResults(input, type);
}

// helper: re-renders the profile page
function renderProfile(username) {
	const url = decodeURIComponent(window.location.href);
	const page = url.split('#')[1];
	// get username from url
	const i = page.indexOf('=');
	let user = page.slice(i+1);
	if (user == username) {
		resetPage(main);
		setupProfile(user);
	}
}
