// authenticate.js 
	// contains functions related to login and registering

import { api, main } from './main.js';
import { resetPage, errorPopup } from './helpers.js';
import { setupFeed } from './feed.js';
import { nonAuthHeader } from './header.js';
import { infiniteScroll } from './infinite_scroll.js';

// helper: update styling for login and register page
function styleNonAuthUsers() {
	// stop running infinite scroll 
	window.removeEventListener('scroll', infiniteScroll);

	// fix up styling 
	main.style.alignItems = 'center';
	main.style.justifyContent = 'center';

	const container = document.getElementById('container');
	container.classList.remove('align-items');
	
	const footer = document.getElementsByTagName('footer')[0];
	footer.style.removeProperty('position');
	footer.style.removeProperty('width');
}

// renders the login page 
export function setupLogin() {
	// render feed if already logged in 
	if (localStorage.getItem('token')) {
		setupFeed();
		return;
	}
	// update history for hash routing 
	history.pushState({page: '1'}, 'login', '/#login');
	document.title = 'Login';
	// render appropriate header 
	nonAuthHeader();
	// adjust styling for page
	styleNonAuthUsers();

	// set up the page
	const boxDiv = document.createElement("div");
	boxDiv.setAttribute("class","auth-box");
	main.appendChild(boxDiv);

	const titleDiv = document.createElement("div");
	titleDiv.setAttribute("class","auth-title");
	boxDiv.appendChild(titleDiv);

	const titleH1 = document.createElement("h1");
	titleH1.innerText = "LOGIN";
	titleDiv.appendChild(titleH1);
	
	const form = document.createElement("form");
	boxDiv.appendChild(form);

	const usernameDiv = document.createElement("div");
	usernameDiv.setAttribute("class","input-div");
	form.appendChild(usernameDiv);

	const usernameInput = document.createElement("input");
	usernameInput.setAttribute("type", "text");
	usernameInput.setAttribute("name", "username");
	usernameInput.setAttribute("placeholder", "Username");
	usernameDiv.appendChild(usernameInput);

	const passwordDiv = document.createElement("div");
	passwordDiv.setAttribute("class","input-div");
	form.appendChild(passwordDiv);
	
	const passwordInput = document.createElement("input");
	passwordInput.setAttribute("type", "password");
	passwordInput.setAttribute("name", "password");
	passwordInput.setAttribute("placeholder", "Password");
	passwordDiv.appendChild(passwordInput);

	const repasswordDiv = document.createElement("div");
	repasswordDiv.setAttribute("class","input-div");
	form.appendChild(repasswordDiv);

	const repasswordInput = document.createElement("input");
	repasswordInput.setAttribute("type", "password");
	repasswordInput.setAttribute("name", "repassword");
	repasswordInput.setAttribute("placeholder", "Re-enter Password");
	repasswordDiv.appendChild(repasswordInput);

	const matchError = document.createElement('p');
	matchError.setAttribute("class","match-error");
	matchError.innerText = "! Passwords didn't match. Try again.";
	matchError.style.display = 'none';
	form.appendChild(matchError);

	const buttonDiv = document.createElement("div");
	buttonDiv.setAttribute("class","input-div");
	form.appendChild(buttonDiv);

	const button = document.createElement("button");
	button.innerText = "Login";
	buttonDiv.appendChild(button);

	const registerDiv = document.createElement("div");
	registerDiv.setAttribute("class","input-div");
	form.appendChild(registerDiv);

	const registerLink = document.createElement("a");
	registerLink.innerText = "New user? Create an account";
	registerDiv.appendChild(registerLink);
	
	// event listener: render register if link pressed
	registerLink.addEventListener('click', () => {
		resetPage(main);
		setupRegister();
	});
	// event listener: check if passwords match 
	passwordInput.addEventListener('blur', () => {
		// 	shows error if password is editted and doesn't match 
		if (repasswordInput.value != '' && passwordInput.value != repasswordInput.value) {
			showError(passwordInput, repasswordInput, matchError);
		}
		else {
			hideError(passwordInput, repasswordInput, matchError);
		}
	});
	// event listener: check if passwords match 
	repasswordInput.addEventListener('blur', (event) => {
		// shows error if repassword is editted and doesn't match 
		if (repasswordInput.value != passwordInput.value) {
			showError(passwordInput, repasswordInput, matchError);
		} else {
			hideError(passwordInput, repasswordInput, matchError);
		}
		
	});
	// event listener: authenticate user when logged in
	button.addEventListener('click', (event) => {
		event.preventDefault();
		const username = form.username.value;
		const password = form.password.value;
		const repassword = form.repassword.value;
		// show error if passwords don't match
		if (password != repassword) {
			errorPopup('Passwords do not match', boxDiv);
		// call api to authorise
		} else {
			api.loginUser(username, password)
			.then(res => {
				// error logging in
				if (res.message) {
					form.reset();
					errorPopup(res.message, boxDiv);
				// login the user
				} else if (res.token) {
					// set up storage
					localStorage.setItem('token', res.token);
					setUserInfo();
					// go to feed
					resetPage(main);
					setupFeed();
				}
			})
			.catch(err => console.warn(`ERROR: ${err.message}`));
		}
	});
}

// renders a page for registering
export function setupRegister() {
	// go to feed if already logged in
	if (localStorage.getItem('token') != undefined) {
		setupFeed();
		return;
	}
	// update history and page title
	history.pushState({page: 2}, 'register', '/#register');
	document.title = 'Register';
	// style header and page
	nonAuthHeader();
	styleNonAuthUsers();

	const boxDiv = document.createElement("div");
	boxDiv.setAttribute("class","auth-box");
	main.appendChild(boxDiv);

	const titleDiv = document.createElement("div");
	titleDiv.setAttribute("class","auth-title");
	boxDiv.appendChild(titleDiv);

	const titleH1 = document.createElement("h1");
	titleH1.innerText = "REGISTER";
	titleDiv.appendChild(titleH1);
	
	const form = document.createElement("form");
	boxDiv.appendChild(form);

	const nameDiv = document.createElement("div");
	nameDiv.setAttribute("class","input-div");
	form.appendChild(nameDiv);

	const nameInput = document.createElement("input");
	nameInput.setAttribute("type", "text"); 
	nameInput.setAttribute("placeholder", "Name");
	nameInput.setAttribute("name", "name");
	nameDiv.appendChild(nameInput);

	const emailDiv = document.createElement("div");
	emailDiv.setAttribute("class","input-div");
	form.appendChild(emailDiv);

	const emailInput = document.createElement("input");
	emailInput.setAttribute("type", "text");
	emailInput.setAttribute("placeholder", "Email");
	emailInput.setAttribute("name", "email");
	emailDiv.appendChild(emailInput);

	const usernameDiv = document.createElement("div");
	usernameDiv.setAttribute("class","input-div");
	form.appendChild(usernameDiv);

	const usernameInput = document.createElement("input");
	usernameInput.setAttribute("type", "text");
	usernameInput.setAttribute("name", "username");
	usernameInput.setAttribute("placeholder", "Username");
	usernameDiv.appendChild(usernameInput);

	const passwordDiv = document.createElement("div");
	passwordDiv.setAttribute("class","input-div");
	form.appendChild(passwordDiv);
	
	const passwordInput = document.createElement("input");
	passwordInput.setAttribute("type", "password");
	passwordInput.setAttribute("name", "password");
	passwordInput.setAttribute("placeholder", "Password");
	passwordDiv.appendChild(passwordInput);

	const repasswordDiv = document.createElement("div");
	repasswordDiv.setAttribute("class","input-div");
	form.appendChild(repasswordDiv);

	const repasswordInput = document.createElement("input");
	repasswordInput.setAttribute("type", "password");
	repasswordInput.setAttribute("name", "repassword");
	repasswordInput.setAttribute("placeholder", "Re-enter Password");
	repasswordDiv.appendChild(repasswordInput);

	const matchError = document.createElement('p');
	matchError.setAttribute("class","match-error");
	matchError.innerText = "! Passwords didn't match. Try again.";
	matchError.style.display = 'none';
	form.appendChild(matchError);

	const buttonDiv = document.createElement("div");
	buttonDiv.setAttribute("class","input-div");
	form.appendChild(buttonDiv);

	const button = document.createElement("button");
	button.innerText = "Register";
	buttonDiv.appendChild(button);

	const loginDiv = document.createElement("div");
	loginDiv.setAttribute("class","input-div");
	form.appendChild(loginDiv);

	const loginLink = document.createElement("a");
	loginLink.innerText = "Already have an account? Login now";
	loginDiv.appendChild(loginLink);
	// clickable link to login page
	loginLink.addEventListener('click', () => {
		resetPage(main);
		setupLogin();
	})

	// checks if password matches after changing password input
	passwordInput.addEventListener('blur', () => {
		if (repasswordInput.value != '' && passwordInput.value != repasswordInput.value) {
			showError(passwordInput, repasswordInput, matchError);
		}
		else {
			hideError(passwordInput, repasswordInput, matchError);
		}
	});

	// checks if repassword matches after changing it 
	repasswordInput.addEventListener('blur', (event) => {
		if (repasswordInput.value != passwordInput.value) {
			showError(passwordInput, repasswordInput, matchError);
		} else {
			hideError(passwordInput, repasswordInput, matchError);
		}
		
	});
	// authenticate the user
	button.addEventListener('click', (event) => {
		event.preventDefault();
		const name = form.name.value;
		const email = form.email.value;
		const username = form.username.value;
		const password = form.password.value;
		const repassword = form.repassword.value;
		// check if passwords match
		if (password != repassword) {
			errorPopup('Passwords do not match', boxDiv);
		// call api to authenticate
		} else {
			api.registerUser(username, password, email, name)
			.then (res => {
				// error occurred
				if (res.message) {
					form.reset();
					errorPopup(res.message, boxDiv);
				// successfully registered, stores info and goes to feed
				} else if (res.token) {
					localStorage.setItem('token', res.token);
					resetPage(main);
					setUserInfo();
					setupFeed();
				}
			})
			.catch(err => console.warn(`ERROR: ${err.message}`));
		}
	});
}

// helper: shows passwords not matching error
function showError(password, repassword, error) {
	password.style.border = '1px solid red';
	repassword.style.border = '1px solid red';
	error.style.display = 'block';
}

// helper: hides error as passwords match
function hideError(password, repassword, error) {
	password.style.border = '1px #E6E6E6 solid';
	repassword.style.border = '1px #E6E6E6 solid';
	error.style.display = 'none';
}

// helper: store users information for later use
function setUserInfo() {
	api.getUserById(null)
	.then(res => {
		localStorage.setItem('id', res.id); 
		localStorage.setItem('username', res.username);
	})
	.catch(err => console.warn(`ERROR: ${err.message}`));
}