(() => {
	const main = document.querySelector('main');
	if (!main) return;

	const inputs = [...main.querySelectorAll('input')];
	const button = main.querySelector('button');
	if (!button) return;

	const showMessage = (message, success = false) => {
		let messageElement = main.querySelector('[data-form-message]');
		if (!messageElement) {
			messageElement = document.createElement('p');
			messageElement.dataset.formMessage = 'true';
			messageElement.className = 'form-message';
			button.insertAdjacentElement('afterend', messageElement);
		}
		messageElement.textContent = message;
		messageElement.classList.toggle('form-message-success', success);
		messageElement.classList.toggle('form-message-error', !success);
	};

	const values = () => inputs.map((input) => input.value.trim());
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const pageText = main.textContent.toLowerCase();

	button.addEventListener('click', (event) => {
		event.preventDefault();

		if (pageText.includes('create an account')) {
			const [username, email, dateOfBirth, password, confirmPassword] = values();
			if (!username || !email || !dateOfBirth || !password || !confirmPassword) {
				showMessage('Please complete every field.');
				return;
			}
			if (!emailPattern.test(email)) {
				showMessage('Please enter a valid email address.');
				return;
			}
			if (password.length < 6) {
				showMessage('Password must contain at least 6 characters.');
				return;
			}
			if (password !== confirmPassword) {
				showMessage('Passwords do not match.');
				return;
			}
			localStorage.setItem('regsTechAccount', JSON.stringify({ username, email, password }));
			showMessage('Account created successfully.', true);
			inputs.forEach((input) => { input.value = ''; });
			return;
		}

		if (pageText.includes('login in to account')) {
			const [email, password] = values();
			const account = JSON.parse(localStorage.getItem('regsTechAccount') || 'null');
			if (!email || !password) {
				showMessage('Please enter your email and password.');
				return;
			}
			if (!emailPattern.test(email)) {
				showMessage('Please enter a valid email address.');
				return;
			}
			if (!account || account.email !== email || account.password !== password) {
				showMessage('Incorrect email or password.');
				return;
			}
			showMessage(`Welcome back, ${account.username}.`, true);
			return;
		}

		const [phone, email, message] = values();
		if (!phone || !email || !message) {
			showMessage('Please complete every field.');
			return;
		}
		if (!emailPattern.test(email)) {
			showMessage('Please enter a valid email address.');
			return;
		}
		showMessage('Thank you. Your message is ready to send.', true);
		inputs.forEach((input) => { input.value = ''; });
	});
})();
