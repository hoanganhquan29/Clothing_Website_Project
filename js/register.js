document.addEventListener('DOMContentLoaded', () => {
    if (typeof loadHeaderFooter === 'function') {
        loadHeaderFooter();
    } else {
        console.warn('loadHeaderFooter function not found. Header/footer placeholders might not be loaded.');
    }
});

function checkPasswordPolicy() {
    const password = document.getElementById('reg-password').value;
    
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

    document.getElementById('policy-length').className = password.length >= minLength ? 'valid' : 'invalid';
    document.getElementById('policy-uppercase').className = hasUpperCase ? 'valid' : 'invalid';
    document.getElementById('policy-lowercase').className = hasLowerCase ? 'valid' : 'invalid';
    document.getElementById('policy-number').className = hasNumbers ? 'valid' : 'invalid';
    document.getElementById('policy-special').className = hasSpecialChar ? 'valid' : 'invalid';
}

function validateRegister() {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return false;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

 
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

    if (password.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        alert('Password does not meet security requirements. Please check the requirements below the password field.');
        return false;
    }


    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some(user => user.username === username || user.email === email);

    if (userExists) {
        alert('Username or Email already registered. Please choose a different one or log in.');
        return false;
    }


    const newUser = {
        username: username,
        email: email,
        password: password 
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful! You can now log in.');
    window.location.href = 'login.html'; 
    return false; 
}