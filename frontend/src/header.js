import { main } from './main.js';
import { resetPage } from './helpers.js';
import { setupLogin } from './authenticate.js';
import { setupProfile } from './profile.js';
import { setupExplore } from './search.js';

// header.js
	// contains functions related to setting up each type of header 
	// contains functions related to header functions e.g. dropdown nav

// renders header for login and register pages
export function nonAuthHeader() {
	const header = document.getElementsByTagName('header')[0];
	resetPage(header);
	header.setAttribute('class', 'banner');
	header.setAttribute('id', 'non-auth-nav');

	const title = document.createElement('h1');
	title.setAttribute('id', 'home');
	title.innerText = 'Quickpic';
	title.addEventListener('click', () => {
		resetPage(main);
		setupLogin();
	});
	header.appendChild(title);
}

// renders small header
export function smallHeader() {
	// checks screen size on startup
	if (document.body.clientWidth > 830) {
		return;
	}
	const header = document.getElementsByTagName('header')[0];
	resetPage(header);
	header.setAttribute('class', 'small-nav fixed');
	header.setAttribute('id', 'small-nav');

	const banner = document.createElement('div');
	banner.setAttribute('class', 'banner');
	header.appendChild(banner);

	const title = document.createElement('h1');
	title.setAttribute('id', 'home');
	title.innerText = 'Quickpic';
	title.addEventListener('click', () => {
		resetPage(main);
		setupLogin();
	});
	banner.appendChild(title);

	const burger = document.createElement('i');
	burger.setAttribute('class', 'burger fas fa-bars fa-2x');
	banner.appendChild(burger);
	// event listener: toggles dropdown navigation 
	burger.addEventListener('click', () => {
		let dropdown = document.getElementById('dropdown');
		if (dropdown == null) {
			setupDropdown(header);
		} else {
			removeDropdown(header);
		}
	});
}

// removes dropdown and overlay if present
export function removeDropdown(header) {
	const dropdown = document.getElementById('dropdown');
	if (dropdown) {
		// get overlay that blocks the rest of the webpage when open
		const overlay = document.getElementById('drop-overlay');
		// remove the overlay if it exists
		if (overlay) {
			main.removeChild(overlay);
		}
		header.removeChild(dropdown);
	}
}

// helper: renders dropdown navigation when using small header 
function setupDropdown(header) {
	// overlay to stop user from pressing other stuff 
	const overlay = document.createElement('overlay');
	overlay.setAttribute('class', 'overlay');
	overlay.setAttribute('id', 'drop-overlay');
	main.appendChild(overlay);
	// close the dropdown if other parts of website are clicked
	overlay.addEventListener('click', () => {
		main.removeChild(overlay);
		header.removeChild(dropdown);
	})

	const dropdown = document.createElement('ul');
	dropdown.setAttribute('id', 'dropdown');
	dropdown.setAttribute('class', 'dropdown');
	header.appendChild(dropdown);

	// search input of dropdown navigation
	const explore = document.createElement('li');
	explore.setAttribute('class', 'explore dropdown-element row-flex-center');
	dropdown.appendChild(explore);

	const search = document.createElement('input');
	search.setAttribute('placeholder', 'Explore...');
	explore.appendChild(search);

	const type = document.createElement('select');
	explore.appendChild(type);

	const feedOption = document.createElement('option');
	feedOption.setAttribute('value', 'feed');
	feedOption.innerText = 'Feed';
	type.appendChild(feedOption);

	const userOption = document.createElement('option');
	userOption.setAttribute('value', 'users');
	userOption.innerText = 'Users';
	type.appendChild(userOption);

	const button = document.createElement('button');
	explore.appendChild(button);

	const searchIcon = document.createElement('i');
	searchIcon.setAttribute('class', 'fas fa-search');
	button.appendChild(searchIcon);

	setupExplore(explore, search, type, button);

	// profile and logout navigation items
	const nav = document.createElement('div');
	dropdown.appendChild(nav);

	const profile = document.createElement('li');
	profile.setAttribute('class', 'nav-item dropdown-element');
	profile.innerText = 'Profile';
	dropdown.appendChild(profile);
	
	const logout = document.createElement('li');
	logout.setAttribute('class', 'nav-item dropdown-element');
	logout.innerText = 'Logout';
	dropdown.appendChild(logout);

	setupNav(profile, logout);
}

// renders large header
export function largeHeader() {
	// checks screen size on startup 
	if (document.body.clientWidth <= 830) {
		return;
	}

	const header = document.getElementsByTagName('header')[0];
	resetPage(header);
	header.setAttribute('class', 'banner large-nav fixed');
	header.setAttribute('id', 'large-nav');

	const title = document.createElement('h1');
	title.setAttribute('id', 'home');
	title.innerText = 'Quickpic';
	// provides a way to go to home aka feed page
	title.addEventListener('click', () => {
		resetPage(main);
		setupLogin();
	});
	header.appendChild(title);

	// search bar in navigation bar 
	const explore = document.createElement('div');
	explore.setAttribute('class', 'explore row-flex-center');
	header.appendChild(explore);

	const search = document.createElement('input');
	search.setAttribute('placeholder', 'Explore...');
	explore.appendChild(search);

	const type = document.createElement('select');
	explore.appendChild(type);

	const feedOption = document.createElement('option');
	feedOption.setAttribute('value', 'feed');
	feedOption.innerText = 'Feed';
	type.appendChild(feedOption);

	const userOption = document.createElement('option');
	userOption.setAttribute('value', 'users');
	userOption.innerText = 'Users';
	type.appendChild(userOption);

	const button = document.createElement('button');
	explore.appendChild(button);

	const searchIcon = document.createElement('i');
	searchIcon.setAttribute('class', 'fas fa-search');
	button.appendChild(searchIcon);

	setupExplore(explore, search, type, button);

	// profile and logout navigation items
	const nav = document.createElement('ul');
	nav.setAttribute('class', 'nav');
	header.appendChild(nav);

	const profile = document.createElement('li');
	profile.setAttribute('class', 'nav-item');
	profile.innerText = 'Profile';
	nav.appendChild(profile);
	
	const logout = document.createElement('li');
	logout.setAttribute('class', 'nav-item');
	logout.innerText = 'Logout';
	nav.appendChild(logout);

	setupNav(profile, logout);

}

// helper: event listeners for navigation items 
function setupNav(profile, logout) {
	// go to profile page 
	profile.addEventListener('click', () => {
		resetPage(main);
		setupProfile(localStorage.getItem('username'));
	});
	// logout the user
	logout.addEventListener('click', () => {
		// reset the webpage and storage
		localStorage.clear();
		resetPage(main);
		const header = document.getElementsByTagName('header')[0];
		header.removeAttribute('id');
		header.removeAttribute('class');
		resetPage(header);
		setupLogin();
	});
}