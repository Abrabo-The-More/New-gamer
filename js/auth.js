/**
 * Industrial School Management System
 * Authentication Module
 */

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// Login function
function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const secretCode = document.getElementById('secretCode').value.trim();
    const userRole = document.getElementById('userRole').value;
    const errorDiv = document.getElementById('loginError');
    
    // Get users from database
    const users = Database.getTable('users');
    
    // Find matching user
    const user = users.find(u => 
        u.username === username && 
        u.password === password && 
        u.code === secretCode &&
        u.role === userRole
    );
    
    if (user) {
        // Save session
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('userId', user.id);
        sessionStorage.setItem('username', user.username);
        sessionStorage.setItem('userName', user.name);
        sessionStorage.setItem('userRole', user.role);
        sessionStorage.setItem('userEmail', user.email);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        // Show error
        errorDiv.classList.add('show');
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 3000);
    }
}

// Check authentication
function checkAuth() {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Get current user
function getCurrentUser() {
    return {
        id: sessionStorage.getItem('userId'),
        username: sessionStorage.getItem('username'),
        name: sessionStorage.getItem('userName'),
        role: sessionStorage.getItem('userRole'),
        email: sessionStorage.getItem('userEmail')
    };
}

// Logout function
function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// Update user info in header
function updateUserInfo() {
    const user = getCurrentUser();
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    
    if (userNameEl && user.name) {
        userNameEl.textContent = user.name;
    }
    if (userRoleEl && user.role) {
        userRoleEl.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }
}

// Initialize login form
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', login);
}

// Initialize on dashboard load
document.addEventListener('DOMContentLoaded', () => {
    // Only check auth if we're on the dashboard page
    if (window.location.href.includes('dashboard.html')) {
        if (checkAuth()) {
            updateUserInfo();
        }
    }
});
