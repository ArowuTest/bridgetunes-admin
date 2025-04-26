// Admin Portal Integration Script
// This file integrates all components with the admin portal

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  initializeModules();
  
  // Set up event listeners
  setupEventListeners();
  
  // Handle authentication
  handleAuthentication();
});

// Initialize all modules
function initializeModules() {
  // Initialize User Segments Module
  window.userSegmentsModule = new UserSegmentsModule();
  
  // Initialize Notification Templates Module
  window.notificationTemplatesModule = new NotificationTemplatesModule();
  
  // Initialize Campaigns Module
  window.campaignsModule = new CampaignsModule(
    window.userSegmentsModule,
    window.notificationTemplatesModule
  );
  
  // Initialize Campaign Templates
  window.campaignTemplatesModule = new CampaignTemplates(
    window.campaignsModule,
    window.userSegmentsModule,
    window.notificationTemplatesModule
  );
  
  // Initialize Notification Logs Module
  window.notificationLogsModule = new NotificationLogsModule();
  
  // Initialize Jackpot Prize Logic
  window.jackpotPrizeLogicModule = new JackpotPrizeLogic();
  
  // Load sample data for demonstration
  loadSampleData();
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
  
  // Modal open/close handlers
  setupModalHandlers();
  
  // Form submission handlers
  setupFormHandlers();
  
  // Logout button
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', function() {
      // Clear authentication data
      localStorage.removeItem('adminAuth');
      
      // Show login page
      document.getElementById('dashboard-page').style.display = 'none';
      document.getElementById('login-page').style.display = 'flex';
    });
  }
}

// Set up modal handlers
function setupModalHandlers() {
  // Segment modal
  setupModalHandler('create-segment-btn', 'create-segment-modal', 'close-segment-modal', 'cancel-segment-btn');
  
  // Template modal
  setupModalHandler('create-template-btn', 'create-template-modal', 'close-template-modal', 'cancel-template-btn');
  
  // Campaign modal
  setupModalHandler('create-campaign-btn', 'create-campaign-modal', 'close-campaign-modal', 'cancel-campaign-btn');
  
  // Template token buttons
  const tokenButtons = document.querySelectorAll('.token-btn');
  tokenButtons.forEach(button => {
    button.addEventListener('click', function() {
      const token = this.getAttribute('data-token');
      const contentTextarea = document.getElementById('template-content');
      
      if (contentTextarea) {
        // Insert token at cursor position
        const cursorPos = contentTextarea.selectionStart;
        const textBefore = contentTextarea.value.substring(0, cursorPos);
        const textAfter = contentTextarea.value.substring(cursorPos);
        
        contentTextarea.value = textBefore + token + textAfter;
        
        // Set focus back to textarea and place cursor after inserted token
        contentTextarea.focus();
        contentTextarea.selectionStart = cursorPos + token.length;
        contentTextarea.selectionEnd = cursorPos + token.length;
      }
    });
  });
}

// Helper function to set up modal open/close handlers
function setupModalHandler(openBtnId, modalId, closeBtnId, cancelBtnId) {
  const openBtn = document.getElementById(openBtnId);
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeBtnId);
  const cancelBtn = document.getElementById(cancelBtnId);
  
  if (openBtn && modal) {
    openBtn.addEventListener('click', function() {
      modal.classList.add('show');
    });
  }
  
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', function() {
      modal.classList.remove('show');
    });
  }
  
  if (cancelBtn && modal) {
    cancelBtn.addEventListener('click', function() {
      modal.classList.remove('show');
    });
  }
}

// Set up form submission handlers
function setupFormHandlers() {
  // Segment form
  const segmentForm = document.getElementById('segment-form');
  const saveSegmentBtn = document.getElementById('save-segment-btn');
  
  if (segmentForm && saveSegmentBtn) {
    saveSegmentBtn.addEventListener('click', function() {
      // Get form values
      const name = document.getElementById('segment-name').value;
      const description = document.getElementById('segment-description').value;
      
      if (!name) {
        showAlert('Please enter a segment name', 'danger');
        return;
      }
      
      // Create segment
      try {
        const segment = window.userSegmentsModule.createSegment(name, description);
        
        // Add criteria
        const criteriaType = document.getElementById('criteria-type').value;
        const criteriaField = document.getElementById('criteria-field').value;
        const criteriaOperator = document.getElementById('criteria-operator').value;
        const criteriaValue = document.getElementById('criteria-value').value;
        
        window.userSegmentsModule.addCriteria(segment.id, {
          type: criteriaType,
          field: criteriaField,
          operator: criteriaOperator,
          value: criteriaValue
        });
        
        // Update UI
        updateSegmentsTable();
        
        // Close modal
        document.getElementById('create-segment-modal').classList.remove('show');
        
        // Reset form
        segmentForm.reset();
        
        showAlert('Segment created successfully', 'success');
      } catch (error) {
        showAlert(`Error creating segment: ${error.message}`, 'danger');
      }
    });
  }
  
  // Template form
  const templateForm = document.getElementById('template-form');
  const saveTemplateBtn = document.getElementById('save-template-btn');
  
  if (templateForm && saveTemplateBtn) {
    saveTemplateBtn.addEventListener('click', function() {
      // Get form values
      const name = document.getElementById('template-name').value;
      const description = document.getElementById('template-description').value;
      const type = document.getElementById('template-type').value;
      const category = document.getElementById('template-category').value;
      const content = document.getElementById('template-content').value;
      
      if (!name || !content) {
        showAlert('Please enter template name and content', 'danger');
        return;
      }
      
      // Create template
      try {
        const template = window.notificationTemplatesModule.createTemplate(
          name, description, type, category, content
        );
        
        // Update UI
        updateTemplatesTable();
        
        // Close modal
        document.getElementById('create-template-modal').classList.remove('show');
        
        // Reset form
        templateForm.reset();
        
        showAlert('Template created successfully', 'success');
      } catch (error) {
        showAlert(`Error creating template: ${error.message}`, 'danger');
      }
    });
  }
  
  // Campaign form
  const campaignForm = document.getElementById('campaign-form');
  const saveCampaignBtn = document.getElementById('save-campaign-btn');
  
  if (campaignForm && saveCampaignBtn) {
    saveCampaignBtn.addEventListener('click', function() {
      // Get form values
      const name = document.getElementById('campaign-name').value;
      const description = document.getElementById('campaign-description').value;
      const segmentId = document.getElementById('campaign-segment').value;
      const templateId = document.getElementById('campaign-template').value;
      const type = document.getElementById('campaign-type').value;
      
      if (!name || !segmentId || !templateId) {
        showAlert('Please enter campaign name, select segment and template', 'danger');
        return;
      }
      
      // Get schedule type
      const scheduleType = document.querySelector('input[name="schedule-type"]:checked').value;
      let schedule = { type: scheduleType };
      
      if (scheduleType === 'future') {
        const scheduleDate = document.getElementById('schedule-date').value;
        const scheduleTime = document.getElementById('schedule-time').value;
        
        if (!scheduleDate || !scheduleTime) {
          showAlert('Please select schedule date and time', 'danger');
          return;
        }
        
        schedule = {
          type: 'scheduled',
          datetime: `${scheduleDate}T${scheduleTime}`
        };
      }
      
      // Create campaign
      try {
        const campaign = window.campaignsModule.createCampaign(
          name, description, segmentId, templateId, type, schedule
        );
        
        // Update UI
        updateCampaignsTable();
        
        // Close modal
        document.getElementById('create-campaign-modal').classList.remove('show');
        
        // Reset form
        campaignForm.reset();
        
        showAlert('Campaign created successfully', 'success');
      } catch (error) {
        showAlert(`Error creating campaign: ${error.message}`, 'danger');
      }
    });
  }
  
  // Login form
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      if (!email || !password) {
        showAlert('Please enter email and password', 'danger', 'alert-container');
        return;
      }
      
      // Attempt login
      loginAdmin(email, password);
    });
  }
}

// Handle authentication
function handleAuthentication() {
  // Check if user is already authenticated
  const authData = localStorage.getItem('adminAuth');
  
  if (authData) {
    try {
      const auth = JSON.parse(authData);
      
      // Check if token is still valid
      if (auth.expiresAt > Date.now()) {
        // Show dashboard
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('dashboard-page').style.display = 'flex';
        
        // Update user info
        document.getElementById('admin-username').textContent = auth.name || 'Admin User';
        document.getElementById('admin-user-type').textContent = auth.role || 'Admin';
        document.getElementById('user-avatar').textContent = (auth.name || 'A').charAt(0);
        
        return;
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
    }
  }
  
  // If not authenticated or token expired, show login page
  document.getElementById('dashboard-page').style.display = 'none';
  document.getElementById('login-page').style.display = 'flex';
}

// Login admin user
function loginAdmin(email, password) {
  // For demo purposes, we'll use a simple check
  // In a real implementation, this would make an API call
  
  // Check for emergency recovery
  if (window.adminRecoverySystem && window.adminRecoverySystem.checkEmergencyAccess(email)) {
    // Grant emergency access
    const recoveryAuth = {
      email: email,
      name: 'Admin User',
      role: 'Admin',
      token: 'emergency_token_' + Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      isEmergencyAccess: true
    };
    
    localStorage.setItem('adminAuth', JSON.stringify(recoveryAuth));
    
    // Show dashboard with recovery banner
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard-page').style.display = 'flex';
    
    // Update user info
    document.getElementById('admin-username').textContent = recoveryAuth.name;
    document.getElementById('admin-user-type').textContent = recoveryAuth.role + ' (Emergency Access)';
    document.getElementById('user-avatar').textContent = recoveryAuth.name.charAt(0);
    
    // Show recovery banner
    showRecoveryBanner();
    
    return;
  }
  
  // Regular authentication
  if (window.adminAuthSystem) {
    try {
      const authResult = window.adminAuthSystem.authenticate(email, password);
      
      if (authResult.success) {
        localStorage.setItem('adminAuth', JSON.stringify({
          email: email,
          name: authResult.name,
          role: authResult.role,
          token: authResult.token,
          expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
        }));
        
        // Show dashboard
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('dashboard-page').style.display = 'flex';
        
        // Update user info
        document.getElementById('admin-username').textContent = authResult.name;
        document.getElementById('admin-user-type').textContent = authResult.role;
        document.getElementById('user-avatar').textContent = authResult.name.charAt(0);
      } else {
        showAlert(authResult.message || 'Invalid email or password', 'danger', 'alert-container');
      }
    } catch (error) {
      showAlert(`Authentication error: ${error.message}`, 'danger', 'alert-container');
    }
  } else {
    // Fallback for demo
    if (email === 'admin@bridgetunes.com' && password === 'admin123') {
      localStorage.setItem('adminAuth', JSON.stringify({
        email: email,
        name: 'Admin User',
        role: 'Super Admin',
        token: 'demo_token_' + Date.now(),
        expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
      }));
      
      // Show dashboard
      document.getElementById('login-page').style.display = 'none';
      document.getElementById('dashboard-page').style.display = 'flex';
      
      // Update user info
      document.getElementById('admin-username').textContent = 'Admin User';
      document.getElementById('admin-user-type').textContent = 'Super Admin
(Content truncated due to size limit. Use line ranges to read in chunks)
