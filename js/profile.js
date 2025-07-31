// js/profile.js
document.addEventListener('DOMContentLoaded', () => {
  
    if (typeof loadHeaderFooter === 'function') {
        loadHeaderFooter();
    } else {
        console.warn('loadHeaderFooter function not found. Header/footer placeholders might not be loaded.');
    }

    const usernameDisplay = document.getElementById('username-display');
    const loggedInUser = localStorage.getItem('loggedInUser'); // 
    const profileAvatar = document.getElementById('profile-avatar'); 


    if (usernameDisplay && loggedInUser) {
        usernameDisplay.textContent = loggedInUser;
     
        if (profileAvatar) {
            profileAvatar.src = `https://i.pravatar.cc/150?u=${loggedInUser}`;
        }
    } else if (!loggedInUser) {
     
        alert('You must be logged in to view your profile.');
        window.location.href = 'login.html';
    }


    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            handleChangePassword();
        });
    }
});

function logout() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('isLoggedIn'); 
    localStorage.removeItem('isAdmin'); 
    
    // localStorage.removeItem('cart');
    alert('You have been logged out.');
    window.location.href = 'index.html'; 
}


function openChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.style.display = 'block';
        
        resetPasswordPolicyDisplay();
    }
}

function closeChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.style.display = 'none';
        
        document.getElementById('changePasswordForm').reset();
        resetPasswordPolicyDisplay(); // Reset policy display
    }
}

// New function to check password policy for the profile page
function checkPasswordPolicyForProfile() {
    const password = document.getElementById('new-password').value;
    
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

    // Update the status of each requirement for profile modal
    document.getElementById('profile-policy-length').className = password.length >= minLength ? 'valid' : 'invalid';
    document.getElementById('profile-policy-uppercase').className = hasUpperCase ? 'valid' : 'invalid';
    document.getElementById('profile-policy-lowercase').className = hasLowerCase ? 'valid' : 'invalid';
    document.getElementById('profile-policy-number').className = hasNumbers ? 'valid' : 'invalid';
    document.getElementById('profile-policy-special').className = hasSpecialChar ? 'valid' : 'invalid';
}

// Helper to reset password policy display to invalid
function resetPasswordPolicyDisplay() {
    const policyElements = [
        'profile-policy-length',
        'profile-policy-uppercase',
        'profile-policy-lowercase',
        'profile-policy-number',
        'profile-policy-special'
    ];
    policyElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.className = 'invalid';
        }
    });
}


function handleChangePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;

    // Basic client-side validation
    if (newPassword !== confirmNewPassword) {
        alert("New password and confirm new password do not match.");
        return;
    }

    // --- APPLY PASSWORD POLICY CHECK HERE ---
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(newPassword);

    if (newPassword.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        alert('New password does not meet security requirements. Please check the requirements below the new password field.');
        return;
    }
    // --- END PASSWORD POLICY CHECK ---

    // --- IMPORTANT: This is where you would normally interact with a backend ---
    // For a real application, you would send currentPassword and newPassword
    // to your server for validation and update in a database.
    //
    // Example of what you MIGHT do if you were storing passwords in localStorage
    // (NOT RECOMMENDED FOR PRODUCTION DUE TO SECURITY RISKS):
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let loggedInUser = localStorage.getItem('loggedInUser'); //

    if (loggedInUser) {
        // Find the user object
        const userIndex = users.findIndex(user => user.username === loggedInUser);

        if (userIndex !== -1) {
            // In a real app, 'users[userIndex].password' would be a hashed password,
            // and you'd compare 'currentPassword' with the hash.
            if (users[userIndex].password === currentPassword) { //
                // Update password (STILL INSECURE FOR PRODUCTION)
                users[userIndex].password = newPassword; //
                localStorage.setItem('users', JSON.stringify(users)); //
                alert('Password changed successfully!');
                closeChangePasswordModal();
            } else {
                alert('Incorrect current password.');
            }
        } else {
            alert('User not found.'); // Should not happen if loggedInUser is set correctly
        }
    } else {
        alert('No user logged in. Please log in first.'); // Should be caught by initial redirect
    }
    // --- End of NOT RECOMMENDED example ---
}