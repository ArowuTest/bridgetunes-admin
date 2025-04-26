// Admin Authentication System
// This file handles admin login, password reset, and session management

// Configuration
const API_URL = 'http://localhost:8080/api/v1'; // Replace with actual API URL in production
const LOCAL_STORAGE_TOKEN_KEY = 'bridgetunes_admin_token';
const LOCAL_STORAGE_USER_KEY = 'bridgetunes_admin_user';

// For demo purposes, we'll use the local JSON file
// In production, this would be replaced with actual API calls
let adminUsers = [];
let adminPermissions = {};

// Fetch admin users data
async function fetchAdminUsers() {
  try {
    const response = await fetch('admin-users.json');
    if (!response.ok) {
      throw new Error('Failed to fetch admin users data');
    }
    const data = await response.json();
    adminUsers = data.users;
    adminPermissions = data.permissions;
    return data;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return null;
  }
}

// Login function
async function loginAdmin(email, password) {
  try {
    // In production, this would be an API call
    await fetchAdminUsers();
    
    // Find user by email
    const user = adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
    
    // In a real implementation, we would verify the password hash
    // For demo purposes, we'll just check if the user exists and is active
    if (!user.isActive) {
      return {
        success: false,
        message: 'Your account is inactive. Please contact the administrator.'
      };
    }
    
    // Get permissions for this user type
    const userPermissions = adminPermissions[user.userType] || {};
    
    // Create a session token (in production, this would be a JWT from the server)
    const token = btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      userType: user.userType,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours expiration
    }));
    
    // Store token and user info in local storage
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email,
      userType: user.userType,
      organization: user.organization,
      permissions: userPermissions
    }));
    
    // Update last login time (in production, this would be done on the server)
    user.lastLogin = new Date().toISOString();
    
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        organization: user.organization,
        permissions: userPermissions
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'An error occurred during login. Please try again.'
    };
  }
}

// Logout function
function logoutAdmin() {
  localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  window.location.href = 'index.html';
}

// Check if user is logged in
function isAdminLoggedIn() {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  if (!token) return false;
  
  try {
    const tokenData = JSON.parse(atob(token));
    // Check if token is expired
    if (tokenData.exp < Date.now()) {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      return false;
    }
    return true;
  } catch (error) {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    return false;
  }
}

// Get current user
function getCurrentAdmin() {
  if (!isAdminLoggedIn()) return null;
  
  const userJson = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    return null;
  }
}

// Check if user has permission
function hasPermission(permissionName) {
  const user = getCurrentAdmin();
  if (!user || !user.permissions) return false;
  
  return user.permissions[permissionName] === true;
}

// Request password reset
async function requestPasswordReset(email) {
  try {
    // In production, this would be an API call
    await fetchAdminUsers();
    
    // Find user by email
    const user = adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return {
        success: false,
        message: 'No account found with this email address'
      };
    }
    
    // In a real implementation, this would send an email with a reset link
    // For demo purposes, we'll just return success
    
    return {
      success: true,
      message: 'Password reset instructions have been sent to your email'
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again.'
    };
  }
}

// Reset password
async function resetPassword(token, newPassword) {
  // In production, this would validate the token and update the password
  // For demo purposes, we'll just return success
  
  return {
    success: true,
    message: 'Password has been reset successfully'
  };
}

// Create new admin user (super admin only)
async function createAdminUser(userData) {
  const currentUser = getCurrentAdmin();
  
  if (!currentUser || !hasPermission('canCreateAdmin')) {
    return {
      success: false,
      message: 'You do not have permission to create admin users'
    };
  }
  
  try {
    // In production, this would be an API call
    // For demo purposes, we'll just return success
    
    return {
      success: true,
      message: 'Admin user created successfully'
    };
  } catch (error) {
    console.error('Create admin error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again.'
    };
  }
}

// Protect admin pages
function protectAdminPage() {
  if (!isAdminLoggedIn()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// Initialize admin header with user info
function initAdminHeader() {
  const user = getCurrentAdmin();
  if (!user) return;
  
  const userNameElement = document.getElementById('admin-username');
  const userTypeElement = document.getElementById('admin-user-type');
  const userOrgElement = document.getElementById('admin-organization');
  
  if (userNameElement) {
    userNameElement.textContent = user.username;
  }
  
  if (userTypeElement) {
    let userTypeDisplay = 'Staff';
    if (user.userType === 'super_admin') userTypeDisplay = 'Super Admin';
    else if (user.userType === 'admin') userTypeDisplay = 'Admin';
    
    userTypeElement.textContent = userTypeDisplay;
  }
  
  if (userOrgElement && user.organization) {
    userOrgElement.textContent = user.organization;
  }
  
  // Setup logout button
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', function(e) {
      e.preventDefault();
      logoutAdmin();
    });
  }
  
  // Hide elements based on permissions
  document.querySelectorAll('[data-requires-permission]').forEach(element => {
    const requiredPermission = element.getAttribute('data-requires-permission');
    if (!hasPermission(requiredPermission)) {
      element.style.display = 'none';
    }
  });
}
