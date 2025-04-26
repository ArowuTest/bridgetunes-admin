// Secure Authentication Module
// This file provides secure authentication functions for the Bridgetunes MTN admin portal

// Constants
const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';
const API_BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Initialize authentication listeners and check current auth status
 */
function initAuth() {
  // Check if user is already authenticated
  checkAuthStatus();
  
  // Add event listeners for hash changes
  window.addEventListener('hashchange', handleHashChange);
  
  // Add event listener for login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    // Prevent traditional form submission which would expose credentials in URL
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleLoginAttempt();
    });
  }
  
  // Add event listener for login button
  const loginButton = document.getElementById('login-button');
  if (loginButton) {
    loginButton.addEventListener('click', function(e) {
      e.preventDefault();
      handleLoginAttempt();
    });
  }
  
  // Add event listener for logout button
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  }
  
  // Add event listeners for navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      navigateTo(page);
    });
  });
}

/**
 * Handle login attempt
 * This function securely processes login credentials without exposing them in the URL
 */
async function handleLoginAttempt() {
  // Get form inputs
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const loginButton = document.getElementById('login-button');
  
  if (!emailInput || !passwordInput) {
    showNotification('error', 'Login form elements not found');
    return;
  }
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  // Validate inputs
  if (!email || !password) {
    showNotification('error', 'Please enter both email and password');
    return;
  }
  
  // Show loading state
  if (loginButton) {
    loginButton.disabled = true;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
  }
  
  try {
    // Attempt to authenticate
    const result = await authenticateUser(email, password);
    
    if (result.success) {
      // Show success message
      showNotification('success', 'Login successful! Redirecting to dashboard...');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigateTo('dashboard');
      }, 1000);
    } else {
      // Show error message
      showNotification('error', result.message || 'Authentication failed');
      
      // Reset button state
      if (loginButton) {
        loginButton.disabled = false;
        loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Show error message
    showNotification('error', 'An error occurred during login. Please try again.');
    
    // Reset button state
    if (loginButton) {
      loginButton.disabled = false;
      loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
    }
  }
}

/**
 * Authenticate user with provided credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Authentication result
 */
async function authenticateUser(email, password) {
  try {
    // First try to authenticate with the backend API
    const apiResult = await authenticateWithAPI(email, password);
    return apiResult;
  } catch (error) {
    console.warn('API authentication failed, falling back to local authentication:', error);
    
    // Fall back to local authentication for development/testing
    return authenticateWithLocalData(email, password);
  }
}

/**
 * Authenticate with backend API
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Authentication result
 */
async function authenticateWithAPI(email, password) {
  try {
    // Make API request
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: email,
        password: password
      })
    });
    
    // Parse response
    const data = await response.json();
    
    // Check if authentication was successful
    if (response.ok && data.token) {
      // Store authentication data
      storeAuthData(data.token, data.user || { email });
      return { success: true };
    } else {
      return {
        success: false,
        message: data.message || 'Invalid credentials'
      };
    }
  } catch (error) {
    console.error('API authentication error:', error);
    throw error;
  }
}

/**
 * Authenticate with local data (fallback for development/testing)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Authentication result
 */
async function authenticateWithLocalData(email, password) {
  try {
    // Fetch admin users from local JSON
    const response = await fetch('admin-users.json');
    if (!response.ok) {
      throw new Error('Failed to fetch admin users data');
    }
    
    const data = await response.json();
    const users = data.users || [];
    
    // Find user by email (case-insensitive)
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    if (user) {
      // Generate token
      const token = generateToken(user);
      
      // Store authentication data
      storeAuthData(token, user);
      
      return { success: true };
    } else {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
  } catch (error) {
    console.error('Local authentication error:', error);
    return {
      success: false,
      message: 'Authentication failed. Please try again.'
    };
  }
}

/**
 * Generate authentication token
 * @param {Object} user - User object
 * @returns {string} Generated token
 */
function generateToken(user) {
  // In a real implementation, this would be a JWT from the server
  // For development/testing, we'll create a simple token with expiration
  const tokenData = {
    id: user.id,
    email: user.email,
    userType: user.userType,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours expiration
  };
  
  // Base64 encode the token data
  return btoa(JSON.stringify(tokenData));
}

/**
 * Store authentication data
 * @param {string} token - Authentication token
 * @param {Object} user - User object
 */
function storeAuthData(token, user) {
  // Store in localStorage
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  
  // Store in cookies for API requests
  setCookie(AUTH_TOKEN_KEY, token, 1); // 1 day
}

/**
 * Clear authentication data
 */
function clearAuthData() {
  // Clear from localStorage
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  
  // Clear from cookies
  setCookie(AUTH_TOKEN_KEY, '', -1);
}

/**
 * Set cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Cookie expiration in days
 */
function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Strict';
}

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
function isAuthenticated() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return false;
  
  try {
    // Parse token to check expiration
    const tokenData = JSON.parse(atob(token));
    if (tokenData.exp < Date.now()) {
      clearAuthData();
      return false;
    }
    return true;
  } catch (error) {
    clearAuthData();
    return false;
  }
}

/**
 * Get authenticated user
 * @returns {Object|null} User object or null if not authenticated
 */
function getAuthenticatedUser() {
  if (!isAuthenticated()) return null;
  
  const userJson = localStorage.getItem(AUTH_USER_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    return null;
  }
}

/**
 * Check authentication status and redirect if necessary
 */
function checkAuthStatus() {
  if (isAuthenticated()) {
    // If user is authenticated and on login page, redirect to dashboard
    if (!window.location.hash || window.location.hash === '#login') {
      navigateTo('dashboard');
    }
    
    // Update user info in sidebar
    updateUserInfo();
  } else {
    // If user is not authenticated and not on login page, redirect to login
    if (window.location.hash && window.location.hash !== '#login') {
      navigateTo('login');
    }
  }
}

/**
 * Handle hash change
 */
function handleHashChange() {
  const hash = window.location.hash.replace('#', '') || 'login';
  
  if (hash === 'login') {
    showLoginPage();
  } else if (hash === 'forgot-password') {
    showForgotPasswordPage();
  } else {
    // For all other hashes, check if user is authenticated
    if (isAuthenticated()) {
      showDashboardPage(hash);
    } else {
      navigateTo('login');
    }
  }
}

/**
 * Navigate to page
 * @param {string} page - Page name
 */
function navigateTo(page) {
  // Use history.pushState to avoid exposing credentials in URL
  history.pushState(null, '', `#${page}`);
  
  // Manually trigger hash change handler
  handleHashChange();
}

/**
 * Show login page
 */
function showLoginPage() {
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('dashboard-page').style.display = 'none';
}

/**
 * Show dashboard page
 * @param {string} section - Dashboard section to show
 */
function showDashboardPage(section) {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('dashboard-page').style.display = 'flex';
  
  // Show the appropriate content section
  document.querySelectorAll('.page-content').forEach(el => {
    el.style.display = 'none';
  });
  
  const contentId = (section || 'dashboard') + '-content';
  const contentElement = document.getElementById(contentId);
  if (contentElement) {
    contentElement.style.display = 'block';
  } else {
    document.getElementById('dashboard-content').style.display = 'block';
  }
  
  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.remove('active');
  });
  
  const activeSection = section || 'dashboard';
  const activeNavLink = document.querySelector(`.nav-link[data-page="${activeSection}"]`);
  if (activeNavLink) {
    activeNavLink.classList.add('active');
  }
  
  // Update user info in sidebar
  updateUserInfo();
}

/**
 * Show forgot password page
 */
function showForgotPasswordPage() {
  // For now, just show a notification
  showNotification('info', 'Password reset functionality is not implemented in this demo. Please contact your administrator.');
  navigateTo('login');
}

/**
 * Logout
 */
function logout() {
  clearAuthData();
  navigateTo('login');
}

/**
 * Update user info in sidebar
 */
function updateUserInfo() {
  const user = getAuthenticatedUser();
  if (!user) return;
  
  // Update user name
  const userNameElement = document.getElementById('admin-username');
  if (userNameElement && user.username) {
    userNameElement.textContent = user.username;
  }
  
  // Update user type
  const userTypeElement = document.getElementById('admin-user-type');
  if (userTypeElement && user.userType) {
    let userTypeDisplay = 'Staff';
    if (user.userType === 'super_admin') userTypeDisplay = 'Super Admin';
    else if (user.userType === 'admin') userTypeDisplay = 'Admin';
    
    userTypeElement.textContent = userTypeDisplay;
  }
  
  // Update user avatar
  const userAvatarElement = document.getElementById('user-avatar');
  if (userAvatarElement && user.username) {
    userAvatarElement.textContent = user.username.charAt(0).toUpperCase();
  }
}

/**
 * Show notification
 * @param {string} type - Notification type (success, error, info, warning)
 * @param {string} message - Notification message
 */
function showNotification(type, message) {
  const alertContainer = document.getElementById('alert-container');
  if (!alertContainer) return;
  
  // Clear previous notifications
  clearNotifications();
  
  // Create notification element
  const alert = document.createElement('div');
  alert.className = `alert alert-${type === 'error' ? 'danger' : type}`;
  
  // Add icon based on type
  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'exclamation-circle';
  if (type === 'warning') icon = 'exclamation-triangle';
  
  alert.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
  
  // Add to container
  alertContainer.appendChild(alert);
  
  // Auto-dismiss success and info notifications after 5 seconds
  if (type === 'success' || type === 'info') {
    setTimeout(() => {
      if (alert.parentNode === alertContainer) {
        alertContainer.removeChild(alert);
      }
    }, 5000);
  }
}

/**
 * Clear notifications
 */
function clearNotifications() {
  const alertContainer = document.getElementById('alert-container');
  if (alertContainer) {
    alertContainer.innerHTML = '';
  }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);

