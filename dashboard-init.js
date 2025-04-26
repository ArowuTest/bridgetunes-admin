// Dashboard Initialization Script
// This file ensures proper dashboard initialization after login

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const isLoggedIn = isAdminLoggedIn();
  
  if (isLoggedIn) {
    // Show dashboard
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard-page').style.display = 'flex';
    
    // Initialize admin header with user info
    initAdminHeader();
    
    // Initialize dashboard components
    initializeDashboardComponents();
  } else {
    // Show login page
    document.getElementById('dashboard-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'flex';
  }
});

// Initialize dashboard components
function initializeDashboardComponents() {
  // Set up navigation
  setupNavigation();
  
  // Load dashboard statistics
  loadDashboardStats();
  
  // Initialize notification modules if they exist
  if (window.userSegmentsModule) {
    updateSegmentsTable();
  }
  
  if (window.notificationTemplatesModule) {
    updateTemplatesTable();
  }
  
  if (window.campaignsModule) {
    updateCampaignsTable();
  }
  
  if (window.notificationLogsModule) {
    updateNotificationLogs();
  }
  
  // Initialize jackpot prize logic if it exists
  if (window.jackpotPrizeLogicModule) {
    updateJackpotPrizeDisplay();
  }
}

// Set up navigation
function setupNavigation() {
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
}

// Load dashboard statistics
function loadDashboardStats() {
  // In a real implementation, this would fetch data from an API
  // For demo purposes, we'll use sample data
  
  // Update user count
  const userCountElement = document.querySelector('.stat-card:nth-child(1) .stat-value');
  if (userCountElement) {
    userCountElement.textContent = '5,432';
  }
  
  // Update topup count
  const topupCountElement = document.querySelector('.stat-card:nth-child(2) .stat-value');
  if (topupCountElement) {
    topupCountElement.textContent = '12,345';
  }
  
  // Update jackpot amount
  const jackpotAmountElement = document.querySelector('.stat-card:nth-child(3) .stat-value');
  if (jackpotAmountElement) {
    jackpotAmountElement.textContent = '₦1,000,000';
  }
  
  // Update notifications count
  const notificationsCountElement = document.querySelector('.stat-card:nth-child(4) .stat-value');
  if (notificationsCountElement) {
    notificationsCountElement.textContent = '3,456';
  }
}

// Update jackpot prize display
function updateJackpotPrizeDisplay() {
  if (!window.jackpotPrizeLogicModule) return;
  
  // Get current day
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Determine if it's a Saturday
  const isSaturday = dayOfWeek === 6;
  
  // Get the appropriate prize structure
  const prizeType = isSaturday ? 'saturday' : 'daily';
  const prizes = window.jackpotPrizeLogicModule.getPrizeStructure(prizeType);
  
  if (prizes && prizes.length > 0) {
    // Update jackpot amount on dashboard
    const jackpotAmountElement = document.querySelector('.stat-card:nth-child(3) .stat-value');
    if (jackpotAmountElement && prizes[0]) {
      jackpotAmountElement.textContent = `₦${prizes[0].amount.toLocaleString()}`;
    }
  }
}
