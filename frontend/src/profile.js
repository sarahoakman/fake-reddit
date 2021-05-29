import { api, main } from './main.js';
import { resetPage, stylingForAuthUser, getModal, errorPopup } from './helpers.js';
import { setupLogin } from './authenticate.js';
import { setupEmptyFeed } from './feed.js';
import { makeFeedPost } from './post.js';
import { smallHeader, largeHeader } from './header.js';
import { infiniteScroll } from './infinite_scroll.js';

// profile.js
	// contains functions related to setting up the profile
	// contains functions related to adding a post
	// contains functions related to following users
	// contains functions related to editing and deleting a post

// renders the profile page
export function setupProfile(user) {
	// go to login page if not logged in 
	if (localStorage.getItem('token') == undefined) {
		setupLogin();
		return;
	}
	// adjust styling 
	stylingForAuthUser();
	smallHeader();
	largeHeader();
	const profileContainer = document.createElement('div');
	main.appendChild(profileContainer);
	profileContainer.style.marginTop = '80px';
	// update title and stop infinte scroll 
	document.title = user + ' Profile';
	window.removeEventListener('scroll', infiniteScroll);

	// get user information 
	api.getUserByUsername(user)
	.then(res => {
		// if user does not exist, show modal message and go to login or feed
		if (res.message) {
			resetPage(main);
			getModal("Uh oh! profile-" + user + " is not a valid page, " + user + " does not exist" , [], 0, null);
			setupLogin();
			return;
		}

		// update the history 
		// check if its the current user
		if (user == localStorage.getItem('username')) {
			history.pushState({page: 4, username: user}, 'profile', '/#' + 'profile=me');
		} else {
			history.pushState({page: 4, username: user}, 'profile', '/#' + 'profile' + '=' + user);
		}
		

		const profileDetails = document.createElement('div');
		profileDetails.setAttribute('class', 'profile-details');
		profileContainer.appendChild(profileDetails);

		const userDetails = document.createElement('div');
		userDetails.setAttribute('class', 'user-details');
		profileDetails.appendChild(userDetails);

		const username = document.createElement('p');
		username.innerText = 'Username: ' + res.username;
		userDetails.appendChild(username);

		const name = document.createElement('p');
		name.innerText = 'Name: ' + res.name;
		userDetails.appendChild(name);

		const email = document.createElement('p');
		email.innerText = 'Email: ' + res.email;
		userDetails.appendChild(email);

	    const followContainer = document.createElement('div');
	    followContainer.setAttribute('class', 'follow-container');
	    profileDetails.appendChild(followContainer);

	    const followDetails = document.createElement('div');
	    followDetails.setAttribute('class', 'follow-details');
	    followContainer.appendChild(followDetails);

	    const followers = document.createElement('p');
	    followers.innerText = 'Followers';
	    followDetails.appendChild(followers);

	    // show following num if not the current user
	    if (user != localStorage.getItem('username')) {
		    const following = document.createElement('p');
		    following.innerText = 'Following';
		    followDetails.appendChild(following);
		// create a button that shows a modal of users we are following
	    } else {
		    const following = document.createElement('button');
		    following.innerText = 'Following';
		    followDetails.appendChild(following);

		    following.addEventListener('click', () => {
		    	const modalObject = getModal('Following', [], 0, null);
			    const modal = modalObject.modal;
			    modal.classList.add('scrollable');
			    res.following.forEach(id => {
			    	api.getUserById(id)
			    	.then(r => {
			    		// creates usernames that are clickable to their profile
			    		const user = document.createElement('p');
						user.setAttribute('class', 'users');
						user.innerText = r.username;
						modal.appendChild(user);
						user.addEventListener('click', () => {
							resetPage(main);
							setupProfile(r.username);
						});
			    	})
			    	.catch(err => console.warn(`ERROR: ${err.message}`));
			    });
			    // following no people so show modal message
			    if (res.following.length == 0) {
			    	const message = document.createElement('p');
					message.setAttribute('class', 'center');
					message.innerText = 'You are following 0 users 😢';
					modal.appendChild(message);
			    }
		    });
	    }

	    const followersNum = document.createElement('p');
	    followersNum.innerText = res.followed_num;
	    followDetails.appendChild(followersNum);

	    const followingNum = document.createElement('p');
	    followingNum.innerText = res.following.length;
	    followDetails.appendChild(followingNum);

	    // put follow button if not the current user
	    if (user != localStorage.getItem('username')) {
	    	const followButton = getFollowButton(res.id, user, followersNum)
			followContainer.appendChild(followButton);
		// set up update profile and adding posts if the current user
	    } else {
	    	const updateProfile = setupUpdateProfile(name, email);
	    	userDetails.appendChild(updateProfile);

	    	const addPost = setupAddPost();
	    	userDetails.appendChild(addPost);
	    }

	    // set up and show all posts made by the user
	    setupProfilePosts(res, profileContainer);
	})
	.catch(err => console.warn(`ERROR: ${err.message}`));
}


// helper: sets up posts made by the user
function setupProfilePosts(res, div) {
	const postTitle = document.createElement('h3');
    postTitle.setAttribute('class', 'post-title');
    postTitle.innerText = 'Posts';
    div.appendChild(postTitle);

    const postContainer = document.createElement('div');
    postContainer.setAttribute('id', 'post-container');
    div.appendChild(postContainer);
    // if the user has 0 posts
    if (res.posts.length == 0) {
    	let message = 'You have 0 posts 😢. Add a post!';
    	if (res.username != localStorage.getItem('user')) {
    		message = res.username + ' has 0 posts 😢';
    	}
		setupEmptyFeed(postContainer, message, 'message');
	// show all posts made the user
	// sort the posts by most recent 
    } else {
		const posts = Promise.all(res.posts.map((id) => api.getPostInfo(id).then(res => res)));
		posts.then(res => {
			const sortedPosts = res.sort((a,b) => b.meta.published - a.meta.published);
			sortedPosts.forEach(post => {
				makeFeedPost(post, false);
			})
		})
		.catch(err => console.warn(`ERROR: ${err.message}`));
	}
}

// helper: set up a follow button 
function getFollowButton(id, username, followers) {
	const followButton = document.createElement('button');
    followButton.setAttribute('class', 'follow-button');
    // check if they are already following and updates button text
    checkFollowing(id, followButton);
    // event listener for clicking follow
    followButton.addEventListener('click', () => {
    	// toggle button text
    	if (followButton.innerText == 'Follow') {
			followButton.innerText = 'Unfollow';
			// follow the user
			api.followUser(username, followers)
			.then(res => {
				api.getUserByUsername(username, followers)
				.then(r => {
					// update number of followers
					followers.innerText = r.followed_num;
				})
				.catch(err => console.warn(`ERROR: ${err.message}`));
			})
			.catch(err => console.warn(`ERROR: ${err.message}`));
    	} else {
    		// toggle button text
			followButton.innerText = 'Follow';
			// unfollow the user
			api.unfollowUser(username, followers)
			.then(res => {
				api.getUserByUsername(username, followers)
				.then(r => {
					// update number of followers
					followers.innerText = r.followed_num;
				})
				.catch(err => console.warn(`ERROR: ${err.message}`));
			})
			.catch(err => console.warn(`ERROR: ${err.message}`));
    	}
    });

    return followButton;
}

// helper: checks if they are following the user for button text
function checkFollowing(user, followButton) {
	api.getUserById()
	.then(res => {
		if (res.following.includes(user)) {
			followButton.innerText = 'Unfollow'
		} else {
			followButton.innerText = 'Follow'
		}
	})
	.catch(err => console.warn(`ERROR: ${err.message}`));
}

// helper: sets up the add post mechanism
function setupAddPost() {
    const add = document.createElement('button');
    add.setAttribute('class', 'add-color');
    add.innerText = 'Add Post';
    // event listener for adding a post
    add.addEventListener('click', () => {
        const title = 'Add Post';
        const textInputs = ['Description'];
        const numImageInputs = 1;
        const button = {
            'text': 'Add Post',
            'class': 'add-color'
        }
        // create a modal with the appropriate inputs
        const modalObject = getModal(title, textInputs, numImageInputs, button);
        // get components of the modal from the return value
        const overlay = modalObject.overlay;
        const modal = modalObject.modal;
        const modalForm = modalObject.form;
        const description = modalForm.description;
        const image = modalForm.image;
        const addButton = modalForm.submit;
        // event listener for submitting 
        addButton.addEventListener('click', () => {
            event.preventDefault();
            // validate the form
            if (description.value == '' || image.value == '') {
                errorPopup('All inputs are required', modalForm);
            // call the api to add the post
            } else {
                addPost(description.value, image, overlay, modal);
            }
        });
    });

    return add;
}

// helper: calls the api to add the post
function addPost(description, image, overlay, modal) {
	const file = image.files[0];
	const reader = new FileReader();
	reader.onloadend = function () {
		 let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token') 
            }, 
            body: JSON.stringify ({
                'description_text': description,
                'src': reader.result.split(',')[1]
            })
        };
    	api.makeAPIRequest('post', options)
    	.then(res => {
    		// show an error popup with invalid image data
    		if (res.post_id == undefined) {
				const modalForm = modal.children[1];
				modalForm.reset();
				errorPopup(res.message, modalForm);
			// remove the modal and add the post to the profile page
			} else {
				main.removeChild(overlay);
		    	main.removeChild(modal);
		    	api.getPostInfo(res.post_id)
		    	.then(r => {
					makeFeedPost(r, true);
				})
				.catch(err => console.warn(`ERROR: ${err.message}`));
			}
    	})
    	.catch(err => console.warn(`ERROR: ${err.message}`));
	}
	// initiate converting the image url
	reader.readAsDataURL(file);
}

// helper: sets up and renders update profile mechanisms
function setupUpdateProfile(name, email) {
	const updateProfile = document.createElement('button');
	updateProfile.setAttribute('class', 'edit-color');
	updateProfile.innerText = 'Edit Profile';
	// event listener for updating the profile
	updateProfile.addEventListener('click', () => {
		// initialising data for the modal
		const title = 'Edit Profile';
		const textInputs = ['Name', 'Email', 'Password'];
		const numImageInputs = 0;
		const button = {
			'text': 'Edit Profile',
			'class': 'edit-color'
		}
		// create a modal from the data
		const modalObject = getModal(title, textInputs, numImageInputs, button);
		// get components of the modal using the returned object
		const overlay = modalObject.overlay;
		const modal = modalObject.modal;
		const modalForm = modalObject.form;
		const nameInput = modalForm.name;
		const emailInput = modalForm.email;
		const passwordInput = modalForm.password;
		passwordInput.setAttribute('type', 'password');
		const updateButton = modalForm.submit;
		// event listener for submitting
		updateButton.addEventListener('click', () => {
			event.preventDefault();
			// show error popup with invalid data
			if (nameInput.value == '' && emailInput.value == '' && passwordInput.value == '') {
				errorPopup('At least 1 input required', modalForm);
			// update the user information on their profile
			} else {
				// call the api to update the user
				api.updateUser(nameInput.value, emailInput.value, passwordInput.value);
				// close the modal
				main.removeChild(overlay);
				main.removeChild(modal);
				// update the profile information
				if (nameInput.value != '') {
					name.innerText = 'Name: ' + nameInput.value;
				}
				if (emailInput.value != '') {
					email.innerText = 'Email: ' + emailInput.value;
				}
			}
		});
	});
	return updateProfile;
}

// renders delete and update buttons to posts on current users profiles
export function addDeleteAndUpdateButtons(postDiv, id) {
	const updateDiv = document.createElement('div');
	updateDiv.setAttribute('class', 'update-flex');
	postDiv.appendChild(updateDiv);

	const delButton = document.createElement('button');
	delButton.innerText = 'Delete Post';
	updateDiv.appendChild(delButton);

	const editButton = document.createElement('button');
	editButton.innerText = 'Edit Post';
	updateDiv.appendChild(editButton);
	// handle deleting a post
	delButton.addEventListener('click', () => {
    	api.deletePosts(id);
    	const postContainer = document.getElementById('post-container');
		const post = document.getElementById('post-' + id);
		postContainer.removeChild(post);
		// show message if no posts remain
		if (!postContainer.hasChildNodes()) {
			setupEmptyFeed(postContainer, 'You have 0 posts 😢. Add a post!', 'message');
		}
	});
	// handle editting a post
	editButton.addEventListener('click', () => {
		// initiate data for the modal
		const title = 'Edit Post';
		const textInputs = ['Description'];
		const numImageInputs = 1;
		const button = {
			'text': 'Edit Post',
			'class': 'add-color'
		}
		// create a modal using the data
		const modalObject = getModal(title, textInputs, numImageInputs, button);
		// get components by the returned object
		const overlay = modalObject.overlay;
		const modal = modalObject.modal;
		const modalForm = modalObject.form;
		const description = modalForm.description;
		const image = modalForm.image;
		const edit = modalForm.submit;
		// event listener for submitting 
		edit.addEventListener('click', () => {
			event.preventDefault();
			// validate the input and show error
			if (description.value == '' && image.value == '') {
				errorPopup('At least 1 input is required', modalForm);
			// edit the post 
			} else {
				editPost(id, description.value, image, overlay, modal);
			}
		});
	});
}

// helper: edits the post by calling the api 
function editPost(id, description, image, overlay, modal) {
	// if the image is updated
	if (image.value != '') {
		const file = image.files[0];
		const reader = new FileReader();
		reader.onloadend = function() {
			const payload = {};
			// get the text if updated too 
			if (description != '') {
				payload['description_text'] = description;
			} 
			payload['src'] = reader.result.split(',')[1];
			// update the post by calling the api
			api.updatePost(payload, id)
			.then(res => {
				// check for success
				if (res.message == 'success') {
					// re-render the post
	        		const img = document.getElementById('post-img-' + id);
	        		img.setAttribute('src', 'data:image/jpeg;base64,' + payload['src']);
	        		if (description != '') {
	        			const h4 = document.getElementById('post-text-' + id);
	        			h4.innerText = description;
	        		}
	        		// close the modal
	        		main.removeChild(overlay)
	    			main.removeChild(modal)
	    		// show an error pop up
	        	} else {
	        		const modalForm = modal.children[1];
	        		modalForm.reset();
	        		errorPopup(res.message, modalForm);
	        	}
			})
			.catch(err => console.warn(`ERROR: ${err.message}`));
		}
		reader.readAsDataURL(file);
	// same as above but without an image 
	} else {
		const payload = {};
		payload['description_text'] = description;
		api.updatePost(payload, id)
		.then(res => {
			if (res.message == 'success') {
        		const h4 = document.getElementById('post-text-' + id);
        		h4.innerText = description;
        		main.removeChild(overlay)
	    		main.removeChild(modal)
        	} else {
        		const modalForm = modal.children[1];
        		modalForm.reset();
        		errorPopup(res.message, modalForm);
        	}
		})
		.catch(err => console.warn(`ERROR: ${err.message}`));
	}

}