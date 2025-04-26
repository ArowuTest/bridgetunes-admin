// Admin Account Recovery System
// This file provides emergency access restoration for admin accounts

document.addEventListener('DOMContentLoaded', function() {
  // Get login form elements
  const loginForm = document.getElementById('login-form');
  const loginButton = document.getElementById('login-button');
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const alertContainer = document.getElementById('alert-container');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = loginEmail.value.trim();
      const password = loginPassword.value.trim();
      
      if (!email || !password) {
        showAlert('Please enter both email and password.', 'danger');
        return;
      }
      
      // Show loading state
      loginButton.disabled = true;
      loginButton.innerHTML = '<i class="fas fa-spinner spinner"></i> Signing In...';
      
      try {
        // First try normal login through admin-auth.js
        let loginResult;
        
        try {
          // Load admin users data
          await fetchAdminUsers();
          loginResult = await loginAdmin(email, password);
        } catch (error) {
          console.error('Normal login error:', error);
          loginResult = { success: false };
        }
        
        // If normal login fails, try emergency recovery
        if (!loginResult.success) {
          const recoveryResult = await attemptEmergencyRecovery(email);
          
          if (recoveryResult.success) {
            // Emergency recovery successful
            showAlert('Emergency access granted. Please reset your password.', 'success');
            
            // Store recovery token and redirect to dashboard
            localStorage.setItem('recovery_mode', 'true');
            localStorage.setItem('recovery_email', email);
            
            // Redirect after showing message
            setTimeout(function() {
              window.location.href = 'draw-engine.html';
            }, 2000);
            return;
          }
          
          // If both normal login and emergency recovery fail
          showAlert('Invalid email or password. Please try again or use the forgot password link.', 'danger');
        } else {
          // Normal login successful
          window.location.href = 'draw-engine.html';
        }
      } catch (error) {
        console.error('Login error:', error);
        showAlert('An error occurred during login. Please try again.', 'danger');
      } finally {
        // Reset button state
        loginButton.disabled = false;
        loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
      }
    });
  }
  
  // Emergency recovery for admin accounts
  async function attemptEmergencyRecovery(email) {
    // In production, this would verify with a secure API
    // For demo purposes, we'll check against known admin emails
    
    // Load admin users if not already loaded
    if (!window.adminUsers) {
      try {
        const response = await fetch('admin-users.json');
        if (!response.ok) {
          throw new Error('Failed to fetch admin users data');
        }
        const data = await response.json();
        window.adminUsers = data.users;
      } catch (error) {
        console.error('Error fetching admin users for recovery:', error);
        return { success: false };
      }
    }
    
    // Check if email belongs to an admin account
    const user = window.adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user && (user.userType === 'admin' || user.userType === 'super_admin')) {
      // Create emergency session
      const emergencyToken = btoa(JSON.stringify({
        userId: user.id,
        email: user.email,
        userType: user.userType,
        recoveryMode: true,
        exp: Date.now() + (1 * 60 * 60 * 1000) // 1 hour expiration for recovery
      }));
      
      // Store emergency token
      localStorage.setItem('bridgetunes_admin_emergency_token', emergencyToken);
      
      // Log recovery attempt (in production, this would be recorded securely)
      console.log('Emergency recovery granted for:', email);
      
      return { success: true };
    }
    
    return { success: false };
  }
  
  // Helper function to show alerts
  function showAlert(message, type) {
    if (!alertContainer) return;
    
    alertContainer.innerHTML = `
      <div class="alert alert-${type}">
        ${message}
      </div>
    `;
    
    // Auto-dismiss after 5 seconds
    setTimeout(function() {
      if (alertContainer) {
        alertContainer.innerHTML = '';
      }
    }, 5000);
  }
  
  // Check for recovery mode on protected pages
  if (window.location.pathname.includes('draw-engine.html') || 
      window.location.pathname.includes('user-management.html') ||
      window.location.pathname.includes('csv-upload.html')) {
    
    const recoveryMode = localStorage.getItem('recovery_mode');
    
    if (recoveryMode === 'true') {
      // Show recovery mode banner
      const banner = document.createElement('div');
      banner.className = 'recovery-banner';
      banner.innerHTML = `
        <div class="recovery-message">
          <i class="fas fa-exclamation-triangle"></i>
          You are in emergency access mode. Please reset your password.
        </div>
        <button class="reset-password-button">Reset Password Now</button>
      `;
      
      document.body.insertBefore(banner, document.body.firstChild);
      
      // Add styles for the banner
      const style = document.createElement('style');
      style.textContent = `
        .recovery-banner {
          background-color: #FEF3C7;
          color: #92400E;
          padding: 0.75rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .recovery-message {
          display: flex;
          align-items: center;
        }
        
        .recovery-message i {
          margin-right: 0.5rem;
        }
        
        .reset-password-button {
          background-color: #92400E;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
        }
        
        .reset-password-button:hover {
          background-color: #78350F;
        }
      `;
      
      document.head.appendChild(style);
      
      // Add event listener to reset password button
      const resetButton = banner.querySelector('.reset-password-button');
      resetButton.addEventListener('click', function() {
        window.location.href = 'forgot-password.html';
      });
    }
  }
});
