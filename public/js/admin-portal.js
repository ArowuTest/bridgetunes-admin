// Admin Portal Authentication Script
// This file handles authentication and portal initialization

// Configuration
const PRODUCTION_API_URL = 'https://api.bridgetunes.com/api/v1'; // Production API URL
const DEVELOPMENT_API_URL = 'http://localhost:8080/api/v1'; // Development API URL
const API_URL = window.location.hostname === 'localhost' ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;
const AUTH_TOKEN_KEY = 'auth_token';

// Initialize admin portal
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Admin Portal...');
    
    // Initialize authentication
    initializeAuth();
    
    // Check URL hash for navigation
    handleHashChange();
    
    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
});

// Initialize authentication
function initializeAuth() {
    console.log('Initializing Authentication...');
    
    // Add event listener for login button
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', handleLogin);
    }
    
    // Add event listener for login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Add event listener for logout button
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    // Check if user is already authenticated
    checkAuthStatus();
}

// Handle login
function handleLogin() {
    console.log('Handling Login...');
    
    // Get email and password
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Validate input
    if (!email || !password) {
        showAlert('danger', 'Please enter both email and password.');
        return;
    }
    
    // Disable login button
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    }
    
    // Clear previous alerts
    clearAlerts();
    
    // Authenticate user
    authenticateUser(email, password)
        .then(result => {
            if (result.success) {
                // Store auth token
                localStorage.setItem(AUTH_TOKEN_KEY, result.token);
                localStorage.setItem('admin_email', email);
                localStorage.setItem('admin_name', result.user?.name || 'Admin User');
                
                // Show success message
                showAlert('success', 'Login successful! Redirecting to dashboard...');
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    document.getElementById('login-page').style.display = 'none';
                    document.getElementById('dashboard-page').style.display = 'flex';
                    
                    // Initialize admin portal components
                    if (typeof initializeAdminPortal === 'function') {
                        initializeAdminPortal();
                    }
                    
                    // Update user info
                    updateUserInfo(result.user);
                    
                    // Set default hash if none
                    if (!window.location.hash) {
                        window.location.hash = 'dashboard';
                    } else {
                        // Trigger hash change to navigate to the correct page
                        handleHashChange();
                    }
                }, 1000);
            } else {
                // Show error message
                showAlert('danger', result.message || 'Invalid email or password.');
                
                // Reset login button
                if (loginButton) {
                    loginButton.disabled = false;
                    loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
                }
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            
            // Show error message
            showAlert('danger', 'An error occurred during login. Please try again.');
            
            // Reset login button
            if (loginButton) {
                loginButton.disabled = false;
                loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            }
        });
}

// Authenticate user
function authenticateUser(email, password) {
    console.log('Authenticating User...');
    
    // Use simple login for development/testing
    return simpleLogin(email, password);
}

// Simple login for development/testing
function simpleLogin(email, password) {
    console.log('Using Simple Login...');
    
    return new Promise((resolve) => {
        // Simulate API call delay
        setTimeout(() => {
            // Add your specific credentials as a fallback
            if (email === 'fsanus20111@gmail.com' && password === 'password') {
                resolve({
                    success: true,
                    token: 'admin_token_' + Math.random().toString(36).substring(2),
                    user: {
                        id: 'admin1',
                        name: 'Admin User',
                        email: email,
                        type: 'admin',
                        organization: 'Bridgetunes'
                    }
                });
                return;
            }
            
            // Check if admin-users.json exists in localStorage
            const adminUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
            
            // If no admin users in localStorage, use hardcoded admin
            if (adminUsers.length === 0) {
                // Check against hardcoded admin credentials
                if (email === 'admin@bridgetunes.com' && password === 'admin123') {
                    resolve({
                        success: true,
                        token: 'sample_token_12345',
                        user: {
                            id: '1',
                            name: 'Admin User',
                            email: 'admin@bridgetunes.com',
                            type: 'admin',
                            organization: 'Bridgetunes'
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid email or password.'
                    });
                }
            } else {
                // Check against stored admin users
                const user = adminUsers.find(u => u.email === email);
                if (user && user.password === password) {
                    resolve({
                        success: true,
                        token: 'sample_token_' + Math.random().toString(36).substring(2),
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            type: user.type || 'admin',
                            organization: user.organization || 'Bridgetunes'
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid email or password.'
                    });
                }
            }
        }, 1000);
    });
}

// Handle logout
function handleLogout() {
    console.log('Handling Logout...');
    
    // Clear auth token
    localStorage.removeItem(AUTH_TOKEN_KEY);
    
    // Show login page
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('dashboard-page').style.display = 'none';
    
    // Reset form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.reset();
    }
    
    // Clear alerts
    clearAlerts();
}

// Check authentication status
function checkAuthStatus() {
    console.log('Checking Auth Status...');
    
    // Get auth token
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    
    if (token) {
        // User is authenticated, show dashboard
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('dashboard-page').style.display = 'flex';
        
        // Initialize admin portal components
        if (typeof initializeAdminPortal === 'function') {
            initializeAdminPortal();
        }
        
        // Update user info
        updateUserInfo({
            name: localStorage.getItem('admin_name') || 'Admin User',
            email: localStorage.getItem('admin_email') || 'admin@bridgetunes.com',
            type: 'admin'
        });
        
        // Set default hash if none
        if (!window.location.hash) {
            window.location.hash = 'dashboard';
        }
    } else {
        // User is not authenticated, show login page
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('dashboard-page').style.display = 'none';
    }
}

// Update user info in the sidebar
function updateUserInfo(user) {
    console.log('Updating User Info:', user);
    
    if (!user) return;
    
    // Update user avatar
    const userAvatar = document.getElementById('user-avatar');
    if (userAvatar) {
        userAvatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'A';
    }
    
    // Update username
    const adminUsername = document.getElementById('admin-username');
    if (adminUsername) {
        adminUsername.textContent = user.name || 'Admin User';
    }
    
    // Update user type
    const adminUserType = document.getElementById('admin-user-type');
    if (adminUserType) {
        adminUserType.textContent = user.type ? user.type.charAt(0).toUpperCase() + user.type.slice(1) : 'Admin';
    }
}

// Handle hash change for navigation
function handleHashChange() {
    console.log('Handling Hash Change...');
    
    const hash = window.location.hash.replace('#', '');
    
    // Default to dashboard if no hash
    const pageId = hash || 'dashboard';
    
    // Get nav link for the page
    const navLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    
    // Click the nav link to navigate
    if (navLink) {
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current link
        navLink.classList.add('active');
        
        // Hide all page content
        document.querySelectorAll('.page-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show selected page content
        const selectedContent = document.getElementById(`${pageId}-content`);
        if (selectedContent) {
            selectedContent.style.display = 'block';
        }
    }
}

// Show alert
function showAlert(type, message) {
    console.log(`Showing ${type} Alert:`, message);
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'exclamation-circle'}"></i>
        ${message}
        <button type="button" class="close" onclick="this.parentElement.remove();">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add alert to container
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        alertContainer.appendChild(alert);
        
        // Auto-remove after 5 seconds for success alerts
        if (type === 'success') {
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
    }
}

// Clear alerts
function clearAlerts() {
    console.log('Clearing Alerts...');
    
    // Get alert container
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        alertContainer.innerHTML = '';
    }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAuth,
        handleLogin,
        authenticateUser,
        simpleLogin,
        handleLogout,
        checkAuthStatus,
        updateUserInfo,
        handleHashChange,
        showAlert,
        clearAlerts
    };
}
