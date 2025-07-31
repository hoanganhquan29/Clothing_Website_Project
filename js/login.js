
function validateLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('loggedInUser', username); 
        alert('Admin login successful!');
        window.location.href = 'admin_dashboard.html';
        return false;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUser', username); 
        alert('Login successful!');
        window.location.href = 'home_page.html';
        return false;
    } else {
        alert('Invalid username or password.');
        return false;
    }
}
