import { api, main } from './main.js';
import { setupLogin } from './authenticate.js';
import { getFollowingPosts } from './push_notif.js';
import { infiniteScroll } from './infinite_scroll.js';
import { smallHeader, largeHeader } from './header.js';
import { resetPage, stylingForAuthUser } from './helpers.js';
import { setupBrowsePosts } from './new_user.js';
import { makeFeedPost } from './post.js';

// feed.js 
	// functions related to setting up the feed

// helper: adjust styling for the feed 
function stylingFeed() {
	main.style.removeProperty('align-items');
	main.style.removeProperty('justify-content');

	const footer = document.getElementsByTagName('footer')[0];
	footer.style.width = '100%';
	
	const container = document.getElementById('container');
	container.classList.add('align-items');
}

// render the feed 
export function setupFeed() {
	if (localStorage.getItem('token') == undefined) {
		setupLogin();
		return;
	}
	// stores a list of post ids of our feed
	getFollowingPosts();
	// adjust styling
	stylingForAuthUser();
	// render a small or large header depending on screen size
	smallHeader();
	largeHeader();
	// update history and document title
	history.pushState({page: 3}, 'feed', '/#feed');
	document.title = 'Feed';
	
	const token = localStorage.getItem('token');
	const postContainer = document.createElement('div');
    postContainer.setAttribute('id', 'post-container');
    postContainer.setAttribute('class', 'post-container');
    main.appendChild(postContainer);

    // initialise local storage for infinite scroll 
    localStorage.setItem('start', 10);
    localStorage.setItem('posts', 0)
    window.addEventListener('scroll', infiniteScroll);

    // get feed for the first 10 posts
	api.getFeed(0)
	.then (res => {
		// if our feed is empty, show a message then show posts to browse through
		if (res.posts.length == 0) {
			window.removeEventListener('scroll', infiniteScroll);
			const message = 'Your feed is empty 😢. Follow more users!';
			setupEmptyFeed(postContainer, message, 'follow-message');
			setupBrowsePosts(postContainer);
		// show the posts in our feed
		} else {
			const posts = res.posts;
			posts.forEach(post => {
				makeFeedPost(post, false);
			});
		}
	})
	.catch(err => console.warn(`ERROR: ${err.message}`));
}

// renders an empty feed with the corresponding message
export function setupEmptyFeed(div, message, id) {
	const emptyMessage = document.createElement('p');
	emptyMessage.innerText = message;
	emptyMessage.setAttribute('class', 'center message');
	emptyMessage.setAttribute('id', id);
	div.appendChild(emptyMessage);
}
