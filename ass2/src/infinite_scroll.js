import { api } from './main.js';
import { makeFeedPost } from './post.js';

// infinite_scroll.js
	// contains functions for making infinite scroll function 
	
// infinite scroll function for the event listener 
export function infiniteScroll() {
	// check if footer is on the screen
	if (checkFooterVisibility()) {
		// check there are more posts available 
		if (localStorage.getItem('posts') % 10 == 0) {
			// get start index and get more posts
			const start = parseInt(localStorage.getItem('start'));
			createFeed(start);
		}
	}
}

// gets more posts for infinite scroll 
function createFeed(start) {
	// check there are more posts available 
	if (localStorage.getItem('posts') % 10 == 0) {
		api.getFeed(start)
		.then(res => {
			// makes a new post and adds it to the feed
			res.posts.forEach(post => {
				makeFeedPost(post);
			});
			// store the total for checking if more posts are available
			const total = res.posts.length;
			localStorage.setItem('posts', total);
			// store the new start index
			const newStart = start + parseInt(localStorage.getItem('posts'));
			localStorage.setItem('start', newStart);
		})
		.catch(err => console.warn(`ERROR: ${err.message}`));
	}
} 

// helper: checks if the footer is visible
function checkFooterVisibility() {
	const footer = document.querySelector('footer');
	// get stats on the position of the footer 
	const position = footer.getBoundingClientRect();
	// check if visible on screen
	// only need to check top and bottom since footer's width is 100%
	if (position.top < 0 || position.bottom > window.innerHeight) {
		return false;
	} 
	return true;
}
