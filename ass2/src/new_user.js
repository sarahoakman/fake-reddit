import { api } from './main.js';
import { makeFeedPost } from './post.js';

// new_user.js
	// contains function related to new user's feed
	// BONUS: method of finding random users to follow

// sets up posts for new users to browse through 
export function setupBrowsePosts(div) {
	const title = document.createElement('h3');
	title.innerText = 'Browse Posts';
	title.setAttribute('class', 'center');
	div.appendChild(title);
	// get a list of 15 numbers from 1-100 
	const postIds = randomNumbers(100, 15);
	postIds.forEach(id => {
		api.getPostInfo(id)
		.then(post => {
			// check if post exists then add it to feed
			if (!post.message) {
				makeFeedPost(post, false);
			}
		})
		.catch(err => console.warn(`ERROR: ${err.message}`));
	})

}

// helper: generates a list of random numbers within 1 to limit 
function randomNumbers(limit, length) {
    let posts = []
    while(posts.length < length) {
        posts.push(Math.floor(Math.random()*limit) + 1)
    }
    return posts;
}
