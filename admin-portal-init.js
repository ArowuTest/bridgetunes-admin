// Admin Portal Initialization Script
// This file ensures proper initialization of all admin portal components

document.addEventListener('DOMContentLoaded', function() {
  // Initialize authentication system
  initializeAuthSystem();
  
  // Check if user is logged in
  const isLoggedIn = isAdminLoggedIn();
  
  if (isLoggedIn) {
    // Show dashboard
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard-page').style.display = 'flex';
    
    // Initialize admin header with user info
    initAdminHeader();
    
    // Initialize all modules
    initializeModules();
    
    // Set up event listeners
    setupEventListeners();
  } else {
    // Show login page
    document.getElementById('dashboard-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'flex';
    
    // Set up login form event listener
    setupLoginForm();
  }
});

// Initialize authentication system
function initializeAuthSystem() {
  // Create global admin auth system object
  window.adminAuthSystem = {
    authenticate: function(email, password) {
      // In production, this would make an API call
      // For demo purposes, we'll use the loginAdmin function from admin-auth.js
      const loginResult = loginAdmin(email, password);
      
      if (loginResult.success) {
        return {
          success: true,
          name: loginResult.user.username,
          role: loginResult.user.userType === 'super_admin' ? 'Super Admin' : 
                loginResult.user.userType === 'admin' ? 'Admin' : 'Staff',
          token: 'auth_token_' + Date.now()
        };
      } else {
        return {
          success: false,
          message: loginResult.message || 'Invalid email or password'
        };
      }
    }
  };
  
  // Create global admin recovery system object
  window.adminRecoverySystem = {
    checkEmergencyAccess: function(email) {
      // Check if email belongs to an admin account
      const adminUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
      const user = adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      return user && (user.userType === 'admin' || user.userType === 'super_admin');
    }
  };
}

// Set up login form event listener
function setupLoginForm() {
  const loginForm = document.getElementById('login-form');
  const loginButton = document.querySelector('#login-form button[type="submit"]');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      if (!email || !password) {
        showAlert('Please enter email and password', 'danger', 'alert-container');
        return;
      }
      
      // Show loading state
      if (loginButton) {
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      }
      
      // Attempt login
      loginAdmin(email, password)
        .then(result => {
          if (result.success) {
            // Show dashboard
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('dashboard-page').style.display = 'flex';
            
            // Update user info
            const user = getCurrentAdmin();
            if (user) {
              document.getElementById('admin-username').textContent = user.username || 'Admin User';
              document.getElementById('admin-user-type').textContent = user.userType || 'Admin';
              document.getElementById('user-avatar').textContent = (user.username || 'A').charAt(0);
            }
            
            // Initialize all modules
            initializeModules();
            
            // Set up event listeners
            setupEventListeners();
          } else {
            showAlert(result.message || 'Invalid email or password', 'danger', 'alert-container');
          }
        })
        .catch(error => {
          showAlert('An error occurred during login. Please try again.', 'danger', 'alert-container');
          console.error('Login error:', error);
        })
        .finally(() => {
          // Reset button state
          if (loginButton) {
            loginButton.disabled = false;
            loginButton.innerHTML = 'Login';
          }
        });
    });
  }
}

// Helper function to show alerts
function showAlert(message, type, containerId) {
  const container = document.getElementById(containerId || 'alert-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="alert alert-${type}">
      ${message}
    </div>
  `;
  
  // Auto-dismiss after 5 seconds
  setTimeout(function() {
    if (container) {
      container.innerHTML = '';
    }
  }, 5000);
}

// Initialize all modules
function initializeModules() {
  // Initialize User Segments Module if not already initialized
  if (!window.userSegmentsModule && typeof UserSegmentsModule === 'function') {
    window.userSegmentsModule = new UserSegmentsModule();
  }
  
  // Initialize Notification Templates Module if not already initialized
  if (!window.notificationTemplatesModule && typeof NotificationTemplatesModule === 'function') {
    window.notificationTemplatesModule = new NotificationTemplatesModule();
  }
  
  // Initialize Campaigns Module if not already initialized
  if (!window.campaignsModule && typeof CampaignsModule === 'function') {
    window.campaignsModule = new CampaignsModule(
      window.userSegmentsModule,
      window.notificationTemplatesModule
    );
  }
  
  // Initialize Notification Logs Module if not already initialized
  if (!window.notificationLogsModule && typeof NotificationLogsModule === 'function') {
    window.notificationLogsModule = new NotificationLogsModule();
  }
  
  // Initialize Jackpot Prize Logic if not already initialized
  if (!window.jackpotPrizeLogicModule && typeof JackpotPrizeLogic === 'function') {
    window.jackpotPrizeLogicModule = new JackpotPrizeLogic();
  }
  
  // Load sample data for demonstration
  loadSampleData();
  
  // Update UI tables
  updateAllTables();
}

// Load sample data for demonstration
function loadSampleData() {
  // Load admin users data if not already loaded
  if (!localStorage.getItem('admin_users')) {
    fetchAdminUsers().then(data => {
      if (data) {
        localStorage.setItem('admin_users', JSON.stringify(data.users));
      }
    });
  }
  
  // Load sample segments if needed
  if (window.userSegmentsModule && window.userSegmentsModule.getSegments().length === 0) {
    window.userSegmentsModule.createSegment('All Users', 'All users in the system');
    window.userSegmentsModule.createSegment('Opted-In Users', 'Users who have opted in to the promotion');
    window.userSegmentsModule.createSegment('High Value Users', 'Users with high transaction values');
    window.userSegmentsModule.createSegment('Inactive Users', 'Users who have not made a transaction in 30 days');
  }
  
  // Load sample templates if needed
  if (window.notificationTemplatesModule && window.notificationTemplatesModule.getTemplates().length === 0) {
    window.notificationTemplatesModule.createTemplate(
      'Welcome Message', 
      'Welcome message for new users', 
      'sms', 
      'onboarding', 
      'Welcome to Bridgetunes! Dial *123# to check your balance and start earning rewards.'
    );
    
    window.notificationTemplatesModule.createTemplate(
      'Draw Reminder', 
      'Reminder about upcoming draw', 
      'sms', 
      'promotional', 
      'Don\'t miss out! The Bridgetunes draw is happening today. Make sure you\'re opted in to win big prizes!'
    );
    
    window.notificationTemplatesModule.createTemplate(
      'Winner Notification', 
      'Notification for draw winners', 
      'sms', 
      'transactional', 
      'Congratulations! You\'ve won {prize_amount} in the Bridgetunes draw. Your prize will be credited to your account within 24 hours.'
    );
  }
  
  // Load sample campaigns if needed
  if (window.campaignsModule && window.campaignsModule.getCampaigns().length === 0) {
    const segments = window.userSegmentsModule.getSegments();
    const templates = window.notificationTemplatesModule.getTemplates();
    
    if (segments.length > 0 && templates.length > 0) {
      window.campaignsModule.createCampaign(
        'Welcome Campaign',
        'Welcome campaign for new users',
        segments[0].id,
        templates[0].id,
        'onboarding',
        { type: 'immediate' }
      );
      
      window.campaignsModule.createCampaign(
        'Daily Draw Reminder',
        'Daily reminder about the draw',
        segments[1].id,
        templates[1].id,
        'promotional',
        { type: 'scheduled', datetime: '2025-04-27T09:00:00' }
      );
    }
  }
}

// Update all tables
function updateAllTables() {
  // Update segments table
  if (window.userSegmentsModule) {
    updateSegmentsTable();
  }
  
  // Update templates table
  if (window.notificationTemplatesModule) {
    updateTemplatesTable();
  }
  
  // Update campaigns table
  if (window.campaignsModule) {
    updateCampaignsTable();
  }
  
  // Update notification logs
  if (window.notificationLogsModule) {
    updateNotificationLogs();
  }
}

// Update segments table
function updateSegmentsTable() {
  const tableBody = document.getElementById('segments-table-body');
  if (!tableBody) return;
  
  const segments = window.userSegmentsModule.getSegments();
  
  tableBody.innerHTML = '';
  
  segments.forEach(segment => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${segment.name}</td>
      <td>${segment.description}</td>
      <td>${segment.estimatedSize || 'N/A'}</td>
      <td>${new Date(segment.createdAt).toLocaleDateString()}</td>
      <td><span class="status-badge status-active">Active</span></td>
      <td>
        <button class="btn btn-icon" data-segment-id="${segment.id}" data-action="edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-icon" data-segment-id="${segment.id}" data-action="delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Update templates table
function updateTemplatesTable() {
  const tableBody = document.getElementById('templates-table-body');
  if (!tableBody) return;
  
  const templates = window.notificationTemplatesModule.getTemplates();
  
  tableBody.innerHTML = '';
  
  templates.forEach(template => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${template.name}</td>
      <td>${template.type}</td>
      <td>${template.category}</td>
      <td>${new Date(template.createdAt).toLocaleDateString()}</td>
      <td><span class="status-badge status-active">Active</span></td>
      <td>
        <button class="btn btn-icon" data-template-id="${template.id}" data-action="edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-icon" data-template-id="${template.id}" data-action="delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Update campaigns table
function updateCampaignsTable() {
  const tableBody = document.getElementById('campaigns-table-body');
  if (!tableBody) return;
  
  const campaigns = window.campaignsModule.getCampaigns();
  
  tableBody.innerHTML = '';
  
  campaigns.forEach(campaign => {
    const row = document.createElement('tr');
    
    // Get segment and template names
    const segment = window.userSegmentsModule.getSegmentById(campaign.segmentId);
    const template = window.notificationTemplatesModule.getTemplateById(campaign.templateId);
    
    row.innerHTML = `
      <td>${campaign.name}</td>
      <td>${segment ? segment.name : 'Unknown'}</td>
      <td>${template ? template.name : 'Unknown'}</td>
      <td>${campaign.schedule.type === 'scheduled' ? new Date(campaign.schedule.datetime).toLocaleString() : 'Immediate'}</td>
      <td><span class="status-badge status-${campaign.status === 'sent' ? 'success' : campaign.status === 'scheduled' ? 'warning' : 'info'}">${campaign.status}</span></td>
      <td>
        <button class="btn btn-icon" data-campaign-id="${campaign.id}" data-action="view">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn btn-icon" data-campaign-id="${campaign.id}" data-action="delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Update notification logs
function updateNotificationLogs() {
  const tableBody = document.getElementById('logs-table-body');
  if (!tableBody) return;
  
  const logs = window.notificationLogsModule.getLogs();
  
  tableBody.innerHTML = '';
  
  logs.forEach(log => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${log.msisdn}</td>
      <td>${log.campaignName}</td>
      <td>${log.messageType}</td>
      <td>${new Date(log.sentAt).toLocaleString()}</td>
      <td><span class="status-badge status-${log.status === 'delivered' ? 'success' : log.status === 'failed' ? 'danger' : 'warning'}">${log.status}</span></td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Set up event listeners for UI interactions
function setupEventListeners() {
  // Sidebar toggle
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      const sidebar = document.getElementById('sidebar');
      const mainContent = document.getElementById('main-content');
      
      sidebar.classList.toggle('sidebar-collapsed');
      mainContent.classList.toggle('main-content-expanded');
    });
  }
  
  // Navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Hide all page content
      const pageContents = document.querySelectorAll('.page-content');
      pageContents.forEach(content => {
        content.style.display = 'none';
      });
      
      // Show the selected page content
      const pageId = this.getAttribute('data-page');
      const pageContent = document.getElementById(`${pageId}-content`);
      if (pageContent) {
        pageContent.style.display = 'block';
      }
    });
  });
  
  // Notification tabs
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Hide all tab content
      const tabContents = document.querySelectorAll('.tab-content');
      tabContents.forEach(content => {
        content.classList.remove('active');
      });
      
      // Show the selected tab content
      const tabId = this.getAttribute('data-tab');
      const tabContent = document.getElementById(`${tabId}-tab`);
      if (tabContent) {
        tabContent.classList.add('active');
      }
    });
  });
  
  // Logout button
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', function() {
      logoutAdmin();
    });
  }
  
  // Set up form submission handlers
  setupFormHandlers();
}

// Set up form submission handlers
function setupFormHandlers() {
  // Create segment button
  const createSegmentBtn = document.getElementById('cr
(Content truncated due to size limit. Use line ranges to read in chunks)
