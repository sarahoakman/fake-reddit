import { api, main } from './main.js';
import { resetPage, convertTitle, convertDate, getModal } from './helpers.js';
import { setupProfile, addDeleteAndUpdateButtons } from './profile.js';

//post.js
	// contains functions for making a post
	// contains functions for liking 
	// contains function for commenting 

// sets up and renders a post
export function makeFeedPost(post, addedPost) {
	const postContainer = document.getElementById('post-container');
	// if an empty feed message is present then delete it
	const message = document.getElementById('message');
		if (message != undefined) {
			postContainer.removeChild(message);
		}

	const postDiv = document.createElement('div');
	postDiv.setAttribute('class', 'post');
	postDiv.setAttribute('id', 'post-' + post.id);
	// if someone just added a post, add it to the top of their profile
	if (addedPost == true) {
		postContainer.prepend(postDiv);
	} else {
		postContainer.appendChild(postDiv);
	}
	
	const imgDiv = document.createElement('div');
	postDiv.appendChild(imgDiv);
	
	const img = document.createElement('img');
	img.setAttribute('class', 'post-img');
	img.setAttribute('id', 'post-img-' + post.id);
	img.setAttribute("src", 'data:image/jpeg;base64,' + post.src);
	img.setAttribute('alt', 'No Post Image Available');
	imgDiv.appendChild(img);

	const descDiv = document.createElement('div');
	descDiv.setAttribute('class', 'post-flex');
	postDiv.appendChild(descDiv);
	
	const h4 = document.createElement('h4');
	h4.setAttribute('class', 'post-text');
	h4.setAttribute('id', 'post-text-' + post.id);
	h4.innerText = post.meta.description_text;
	descDiv.appendChild(h4);
	
	const userDiv = document.createElement('div');
	userDiv.setAttribute('class', 'userdesc-flex');
	descDiv.appendChild(userDiv);
	
	const userDetails = document.createElement('div');
	userDetails.setAttribute('class', 'post-text post-user');
	userDiv.appendChild(userDetails);

	const details = document.createElement('p');
	details.innerText = 'Posted by ';
	userDetails.appendChild(details);

	const author = document.createElement('a');
	author.innerText = post.meta.author;
	userDetails.appendChild(author);

	const date = document.createElement('p');
	date.innerText = ' on ' + convertDate(post.meta.published);
	userDetails.appendChild(date);

	const detailsDiv = document.createElement('div');
	detailsDiv.setAttribute('class', 'desc-flex');
	descDiv.appendChild(detailsDiv);

	const likesDiv = document.createElement('div');
	likesDiv.setAttribute('class', 'post-text');
	likesDiv.setAttribute('id', 'likes-div-' + post.id);
	detailsDiv.appendChild(likesDiv);
	
	const likesOuter = document.createElement('div');
	likesOuter.setAttribute('class', 'post-outer');
	likesOuter.setAttribute('id', 'likes-outer-' + post.id);
	likesDiv.appendChild(likesOuter);

	const likes = document.createElement('p');
	likes.setAttribute('id', 'like-post-' + post.id);
	const numLikes = post.meta.likes.length;
	likes.innerText = convertTitle(post.meta.likes.length, 'like');
	
	likesOuter.appendChild(likes);

	// check if the user already liked the post
	const likeButton = document.createElement('button')
	if (post.meta.likes.includes(parseInt(localStorage.getItem('id')))) {
		likeButton.innerText = 'Unlike';
	} else {
		likeButton.innerText = 'Like';
	}
	likesOuter.appendChild(likeButton);

	// create a div to show the usernames of people that liked
	const listLikesDiv = document.createElement('div');
	listLikesDiv.setAttribute('id', 'user-likes-' + post.id);
	listLikesDiv.setAttribute('class', 'interact-div');
	// hide the list initially
	listLikesDiv.style.display = 'none';
	likesDiv.appendChild(listLikesDiv);

	// create a list of usernames from user ids of users that liked the post
	const listLikes = Promise.all(post.meta.likes.map((id) => api.getUserById(id).then(res => res.username)));
	// add the usernames to the div
	listLikes.then(res => {
		res.forEach(username => {
			const user = document.createElement('p');
			user.setAttribute('class', 'username');
			user.innerText = username;
			listLikesDiv.appendChild(user);
			// add functionality so that usernames take to the profile page
			user.addEventListener('click', () => {
				resetPage(main);
				setupProfile(username);
			});
		});
	})
	.catch(err => console.warn(`ERROR: ${err.message}`));
	
	const commentsDiv = document.createElement('div');
	commentsDiv.setAttribute('class', 'post-text');
	detailsDiv.appendChild(commentsDiv);

	const commentsOuter = document.createElement('div');
	commentsOuter.setAttribute('class', 'post-outer');
	commentsDiv.appendChild(commentsOuter);

	const comments = document.createElement('p');
	comments.setAttribute('id', 'comment-post-' + post.id);
	const numComments= post.comments.length;
	comments.innerText = convertTitle(post.comments.length, 'comment');
	commentsOuter.appendChild(comments);

	const commentButton = document.createElement('button');
	commentButton.innerText = 'Comment';
	commentsOuter.appendChild(commentButton);

	// create a div for showing the comments
	const listCommentsDiv = document.createElement('div');
	listCommentsDiv.setAttribute('id', 'user-comments-' + post.id);
	listCommentsDiv.setAttribute('class', 'interact-div');
	// hidden initially
	listCommentsDiv.style.display = 'none';
	commentsDiv.appendChild(listCommentsDiv);
	// sort the list of comments by date
	post.comments = post.comments.sort((a,b) => a.published - b.published);
	post.comments.forEach(comment => {
		// set up the comments and add to div
		const author = document.createElement('p');
		author.setAttribute('class', 'username');
		author.innerText = comment.author;
		listCommentsDiv.appendChild(author);

		const date = document.createElement('p');
		date.setAttribute('class', 'date');
		date.innerText = convertDate(comment.published)
		listCommentsDiv.appendChild(date);

		const text = document.createElement('p');
		text.setAttribute('class', 'comment');
		text.innerText = comment.comment; 
		listCommentsDiv.appendChild(text);
		// add functionality so that usernames take to their profile
		author.addEventListener('click', () => {
			resetPage(main);
			setupProfile(comment.author);
		});
	});
	// add functionality so that usernames take to their profile
	author.addEventListener('click', () => {
		resetPage(main);
		setupProfile(post.meta.author);
	});

	// toggle the div showing users that liked the post
	likes.addEventListener('click', () => {
		let numLikes = document.getElementById('like-post-' + post.id);
		numLikes = parseInt(numLikes.innerText.split(' ')[0])
		if (numLikes != 0) {
			if (listLikesDiv.style.display == 'none') {
				listLikesDiv.style.display = 'block';
			} else {
				listLikesDiv.style.display = 'none';
			}
		}
	});

	// check if the user pressed like/unlike
	likeButton.addEventListener('click', (event) => {
		// clicked like
		if (event.target.innerText == 'Like') {
			// call the api and like the post
			api.likePost(post.id)
			// live update the likes
			.then(res => updateLikes(post.id))
			.catch(err => console.warn(`ERROR: ${err.message}`));
			// change the buttons text
			event.target.innerText = 'Unlike';
		// clicked unlike
		} else {
			// call the api and unlike the post
			api.unlikePost(post.id)
			// live update the likes
			.then(res => updateLikes(post.id))
			.catch(err => console.warn(`ERROR: ${err.message}`));
			// change the buttons text
			event.target.innerText = 'Like';
		}
		
	});

	// creates a div for comment input or closes the div
	commentButton.addEventListener('click', () => {
		let commentInputDiv = document.getElementById('comment-input-' + post.id);
		// the div is closed, so create the div
		if (commentInputDiv == null) {
			const commentInputDiv = document.createElement('div');
			commentInputDiv.setAttribute('class', 'comment-input-div');
			commentInputDiv.setAttribute('id', 'comment-input-' + post.id);
			commentsDiv.appendChild(commentInputDiv);

			const commentInput = document.createElement('input');
			commentInput.setAttribute('class', 'comment-input');
			commentInput.setAttribute('type', 'text');
			commentInput.setAttribute('placeholder', 'Comment');
			commentInputDiv.appendChild(commentInput);

			const addButton = document.createElement('button');
			addButton.setAttribute('class', 'add-comment-button');
			addButton.innerText = 'Add';
			commentInputDiv.appendChild(addButton);

			// able to close the div
			const closeButton = document.createElement('button');
			closeButton.setAttribute('class', 'close-comment-button');
			closeButton.innerText = '✕';
			commentInputDiv.appendChild(closeButton);
			//handle adding a comment
			addButton.addEventListener('click', () => {
				// validate input
				if (commentInput.value == '') {
					getModal('Comment cannot be empty', [], 0, null);
				} else {
					// remove old div
					commentsDiv.removeChild(commentInputDiv);
					// call the api to add the comment
					api.addComment(commentInput.value, post.id)
					.then(res => {
						// get the new post comments
						api.getPostInfo(post.id)
						.then(r => {
							// live update the comments
							updateComment(r);
						})
						.catch(err => console.warn(`ERROR: ${err.message}`));
					})
					.catch(err => console.warn(`ERROR: ${err.message}`));
				}
			})
			// close the comment input 
			closeButton.addEventListener('click', () => {
				commentsDiv.removeChild(commentInputDiv);
			})
		} 
		
	});
	// toggle the div that shows the comments by users
	comments.addEventListener('click', () => {
		// only show comments if there are > 0
		let numComments = document.getElementById('comment-post-' + post.id);
		numComments = parseInt(numComments.innerText.split(' ')[0])
		if (numComments != 0) {
			// toggle to show or hide
			if (listCommentsDiv.style.display == 'none') {
				listCommentsDiv.style.display = 'block';
			} else {
				listCommentsDiv.style.display = 'none';
			}
		}
	});
	// give ability to user to delete and update posts on profile page
	if (post.meta.author == localStorage.getItem('username')) {
		addDeleteAndUpdateButtons(postDiv, post.id);
	}
}


// calls api to get new likes
function updateLikes(id) {
	api.getPostInfo(id)
	.then(res => {
		const likesDiv = document.getElementById('likes-div-' + id);
		resetLikes(id, res.meta.likes, likesDiv);
	})
	.catch(err => console.warn(`ERROR: ${err.message}`));
}

// re-render the likes 
function resetLikes(postId, postLikes, likesDiv) {
	const likes = document.getElementById('like-post-' + postId);
	// creates a suitable title for the amount of likes
	likes.innerText = convertTitle(postLikes.length, 'like');
	// remove old likes
	const listLikesDiv = document.getElementById('user-likes-' + postId);
	resetPage(listLikesDiv);
	// hide the div if no one has liked
	if (postLikes.length == 0) {
		listLikesDiv.style.display = 'none';
	}
	// gets list of usernames from ids
	const listLikes = Promise.all(postLikes.map((id) => api.getUserById(id).then(res => res.username)));
	listLikes.then(res => {
		res.forEach(username => {
			// creates list of usernames that are clickable to their profile
			const user = document.createElement('p');
			user.setAttribute('class', 'username');
			user.innerText = username;
			listLikesDiv.appendChild(user);
			user.addEventListener('click', () => {
				resetPage(main);
				setupProfile(username);
			});
		});
	})
	.catch(err => console.warn(`ERROR: ${err.message}`));
	
	likesDiv.appendChild(listLikesDiv);
}

// re-renders a list of comments
function updateComment(res) {
	const div = document.getElementById('user-comments-' + res.id);
	const title = document.getElementById('comment-post-' + res.id);
	title.innerText = convertTitle(res.comments.length, 'comment');
	res.comments = res.comments.sort((a,b) => a.published - b.published);
	const comment = res.comments[res.comments.length - 1]
	const author = document.createElement('p');
	author.setAttribute('class', 'username');
	author.innerText = comment.author;

	div.appendChild(author);
	const date = document.createElement('p');
	date.setAttribute('class', 'date');
	date.innerText = convertDate(comment.published);
	div.appendChild(date);

	const text = document.createElement('p');
	text.setAttribute('class', 'comment');
	text.innerText = comment.comment; 
	div.appendChild(text);
}