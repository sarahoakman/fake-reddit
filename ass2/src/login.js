export { setupLogin , resetPage , setupRegister }

function setupLogin(main) {
	const boxDiv = document.createElement("div");
	boxDiv.setAttribute("class","login-box");

	const titleDiv = document.createElement("div");
	titleDiv.setAttribute("class","login-title");
	const titleH1 = document.createElement("h1");
	titleH1.innerText = "LOGIN";

	const form = document.createElement("form");

	const usernameDiv = document.createElement("div");
	usernameDiv.setAttribute("class","input-div");
	const usernameInput = document.createElement("input");
	usernameInput.setAttribute("type", "text");
	usernameInput.setAttribute("name", "username");
	usernameInput.setAttribute("placeholder", "Username");

	const passwordDiv = document.createElement("div");
	passwordDiv.setAttribute("class","input-div");
	const passwordInput = document.createElement("input");
	passwordInput.setAttribute("type", "password");
	passwordInput.setAttribute("name", "password");
	passwordInput.setAttribute("placeholder", "Password");

	const repasswordDiv = document.createElement("div");
	repasswordDiv.setAttribute("class","input-div");
	const repasswordInput = document.createElement("input");
	repasswordInput.setAttribute("type", "password");
	repasswordInput.setAttribute("name", "repassword");
	repasswordInput.setAttribute("placeholder", "Re-enter Password");

	const buttonDiv = document.createElement("div");
	buttonDiv.setAttribute("class","input-div");
	const button = document.createElement("button");
	button.setAttribute("id","login-button");
	button.innerText = "Login";

	const registerDiv = document.createElement("div");
	registerDiv.setAttribute("class","input-div");
	const registerLink = document.createElement("a");
	registerLink.innerText = "New user? Create an account";

	titleDiv.appendChild(titleH1);
	boxDiv.appendChild(titleDiv);
	usernameDiv.appendChild(usernameInput);
	passwordDiv.appendChild(passwordInput);
	repasswordDiv.appendChild(repasswordInput);
	registerDiv.appendChild(registerLink);
	buttonDiv.appendChild(button);
	form.appendChild(usernameDiv);
	form.appendChild(passwordDiv);
	form.appendChild(repasswordDiv);
	form.appendChild(registerDiv);
	form.appendChild(buttonDiv);
	boxDiv.appendChild(form);
	main.appendChild(boxDiv);

	registerLink.addEventListener('click', () => {
		resetPage(main);
		setupRegister(main);
	});

	repasswordInput.addEventListener('blur', () => {
		if (repasswordInput.value != passwordInput.value) {
			alert('passwords do not match');
		}
	});
}

function resetPage(main) {
	let child = main.lastChild;
	while (child) {
		main.removeChild(child);
		child = main.lastChild;
	}
}

function setupRegister(main) {
	const boxDiv = document.createElement("div");
	boxDiv.setAttribute("class","login-box");

	const titleDiv = document.createElement("div");
	titleDiv.setAttribute("class","login-title");
	const titleH1 = document.createElement("h1");
	titleH1.innerText = "REGISTER";

	const form = document.createElement("form");

	const nameDiv = document.createElement("div");
	nameDiv.setAttribute("class","input-div");
	const nameInput = document.createElement("input");
	nameInput.setAttribute("type", "text");
	nameInput.setAttribute("placeholder", "Name");

	const emailDiv = document.createElement("div");
	emailDiv.setAttribute("class","input-div");
	const emailInput = document.createElement("input");
	emailInput.setAttribute("type", "text");
	emailInput.setAttribute("placeholder", "Email");

	const usernameDiv = document.createElement("div");
	usernameDiv.setAttribute("class","input-div");
	const usernameInput = document.createElement("input");
	usernameInput.setAttribute("type", "text");
	usernameInput.setAttribute("placeholder", "Username");

	const passwordDiv = document.createElement("div");
	passwordDiv.setAttribute("class","input-div");
	const passwordInput = document.createElement("input");
	passwordInput.setAttribute("type", "text");
	passwordInput.setAttribute("placeholder", "Password");

	const repasswordDiv = document.createElement("div");
	repasswordDiv.setAttribute("class","input-div");
	const repasswordInput = document.createElement("input");
	repasswordInput.setAttribute("type", "text");
	repasswordInput.setAttribute("placeholder", "Username");

	const buttonDiv = document.createElement("div");
	buttonDiv.setAttribute("class","input-div");
	const button = document.createElement("button");
	button.innerText = "Login";

	const loginDiv = document.createElement("div");
	loginDiv.setAttribute("class","input-div");
	const loginLink = document.createElement("a");
	loginLink.innerText = "Already have an account? Login now";

	titleDiv.appendChild(titleH1);
	boxDiv.appendChild(titleDiv);
	nameDiv.appendChild(nameInput);
	emailDiv.appendChild(emailInput);
	usernameDiv.appendChild(usernameInput);
	passwordDiv.appendChild(passwordInput);
	repasswordDiv.appendChild(repasswordInput);
	loginDiv.appendChild(loginLink);
	buttonDiv.appendChild(button);
	form.appendChild(nameDiv);
	form.appendChild(emailDiv);
	form.appendChild(usernameDiv);
	form.appendChild(passwordDiv);
	form.appendChild(repasswordDiv);
	form.appendChild(loginDiv);
	form.appendChild(buttonDiv);
	boxDiv.appendChild(form);
	main.appendChild(boxDiv);

	loginLink.addEventListener('click', () => {
		resetPage(main);
		setupLogin(main);
	})
}