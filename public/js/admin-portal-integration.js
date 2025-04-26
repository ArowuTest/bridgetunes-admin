// Admin Portal Integration
// This file connects all components to the backend API

// Configuration
const PRODUCTION_API_URL = 'https://api.bridgetunes.com/api/v1'; // Production API URL
const DEVELOPMENT_API_URL = 'http://localhost:8080/api/v1'; // Development API URL
const API_URL = window.location.hostname === 'localhost' ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;

// Initialize admin portal
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Admin Portal Integration...');
    
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
        console.log('User is authenticated, initializing components...');
        initializeAdminPortal();
    }
});

// Initialize admin portal components
function initializeAdminPortal() {
    console.log('Initializing Admin Portal Components...');
    
    // Initialize notification management
    initializeNotificationManagement();
    
    // Initialize draw management
    initializeDrawManagement();
    
    // Initialize user management
    initializeUserManagement();
    
    // Initialize CSV upload
    initializeCSVUpload();
    
    // Initialize admin creation
    initializeAdminCreation();
    
    // Load component content
    loadComponentContent();
}

// Initialize notification management
function initializeNotificationManagement() {
    console.log('Initializing Notification Management...');
    
    // Check if notification management service is available
    if (typeof NotificationManagementService !== 'undefined') {
        // Initialize notification management service
        const notificationService = new NotificationManagementService(API_URL);
        
        // Load notification templates
        notificationService.loadTemplates();
        
        // Load user segments
        notificationService.loadUserSegments();
        
        // Load campaigns
        notificationService.loadCampaigns();
    } else {
        console.warn('NotificationManagementService not found, skipping initialization.');
    }
}

// Initialize draw management
function initializeDrawManagement() {
    console.log('Initializing Draw Management...');
    
    // Check if draw management service is available
    if (typeof DrawManagementService !== 'undefined') {
        // Initialize draw management service
        const drawService = new DrawManagementService(API_URL);
        
        // Load draw history
        drawService.loadDrawHistory();
        
        // Load jackpot configuration
        drawService.loadJackpotConfiguration();
    } else {
        console.warn('DrawManagementService not found, skipping initialization.');
    }
}

// Initialize user management
function initializeUserManagement() {
    console.log('Initializing User Management...');
    
    // Check if user management service is available
    if (typeof UserManagementService !== 'undefined') {
        // Initialize user management service
        const userService = new UserManagementService(API_URL);
        
        // Load users
        userService.loadUsers();
    } else {
        console.warn('UserManagementService not found, skipping initialization.');
    }
}

// Initialize CSV upload
function initializeCSVUpload() {
    console.log('Initializing CSV Upload...');
    
    // Check if CSV upload service is available
    if (typeof CSVUploadService !== 'undefined') {
        // Initialize CSV upload service
        const csvService = new CSVUploadService(API_URL);
        
        // Initialize file upload listeners
        csvService.initializeFileUploadListeners();
    } else {
        console.warn('CSVUploadService not found, skipping initialization.');
    }
}

// Initialize admin creation
function initializeAdminCreation() {
    console.log('Initializing Admin Creation...');
    
    // Add event listener for admin creation form
    const adminCreationForm = document.getElementById('admin-creation-form');
    if (adminCreationForm) {
        adminCreationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('admin-name').value;
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
            const type = document.getElementById('admin-type').value;
            const organization = document.getElementById('admin-organization')?.value || 'Bridgetunes';
            
            // Validate input
            if (!name || !email || !password || !type) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Create admin user
            createAdminUser(name, email, password, type, organization);
        });
    }
}

// Create admin user
function createAdminUser(name, email, password, type, organization) {
    console.log('Creating Admin User:', name, email, type, organization);
    
    // Get existing admin users
    const adminUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
    
    // Check if email already exists
    if (adminUsers.find(user => user.email === email)) {
        alert('Email already exists.');
        return;
    }
    
    // Create new admin user
    const newUser = {
        id: 'admin_' + Math.random().toString(36).substring(2),
        name,
        email,
        password,
        type,
        organization,
        createdAt: new Date().toISOString()
    };
    
    // Add new user to admin users
    adminUsers.push(newUser);
    
    // Save admin users
    localStorage.setItem('admin_users', JSON.stringify(adminUsers));
    
    // Show success message
    alert('Admin user created successfully.');
    
    // Reset form
    document.getElementById('admin-creation-form').reset();
}

// Load component content
function loadComponentContent() {
    console.log('Loading Component Content...');
    
    // Load notification content
    loadNotificationContent();
    
    // Load draw content
    loadDrawContent();
    
    // Load user content
    loadUserContent();
    
    // Load transaction content
    loadTransactionContent();
}

// Load notification content
function loadNotificationContent() {
    console.log('Loading Notification Content...');
    
    // Get notification content container
    const notificationContent = document.getElementById('notification-content');
    if (notificationContent) {
        // Load notification templates
        const templateContainer = document.getElementById('notification-templates-container');
        if (templateContainer) {
            // Load notification templates
            fetch('/notification-templates.html')
                .then(response => response.text())
                .then(html => {
                    templateContainer.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading notification templates:', error);
                });
        }
        
        // Load user segments
        const segmentContainer = document.getElementById('user-segments-container');
        if (segmentContainer) {
            // Load user segments
            fetch('/user-segments.html')
                .then(response => response.text())
                .then(html => {
                    segmentContainer.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading user segments:', error);
                });
        }
        
        // Load campaigns
        const campaignContainer = document.getElementById('campaigns-container');
        if (campaignContainer) {
            // Load campaigns
            fetch('/campaigns.html')
                .then(response => response.text())
                .then(html => {
                    campaignContainer.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading campaigns:', error);
                });
        }
    }
}

// Load draw content
function loadDrawContent() {
    console.log('Loading Draw Content...');
    
    // Get draw content container
    const drawContent = document.getElementById('draw-content');
    if (drawContent) {
        // Load draw engine
        const drawEngineContainer = document.getElementById('draw-engine-container');
        if (drawEngineContainer) {
            // Load draw engine
            fetch('/draw-engine.html')
                .then(response => response.text())
                .then(html => {
                    drawEngineContainer.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading draw engine:', error);
                });
        }
        
        // Load draw history
        const drawHistoryContainer = document.getElementById('draw-history-container');
        if (drawHistoryContainer) {
            // Load draw history
            fetch('/draw-history.html')
                .then(response => response.text())
                .then(html => {
                    drawHistoryContainer.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading draw history:', error);
                });
        }
    }
}

// Load user content
function loadUserContent() {
    console.log('Loading User Content...');
    
    // Get user content container
    const userContent = document.getElementById('user-content');
    if (userContent) {
        // Load user management
        const userManagementContainer = document.getElementById('user-management-container');
        if (userManagementContainer) {
            // Load user management
            fetch('/user-management.html')
                .then(response => response.text())
                .then(html => {
                    userManagementContainer.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading user management:', error);
                });
        }
    }
}

// Load transaction content
function loadTransactionContent() {
    console.log('Loading Transaction Content...');
    
    // Get transaction content container
    const transactionContent = document.getElementById('transaction-content');
    if (transactionContent) {
        // Load transaction management
        const transactionManagementContainer = document.getElementById('transaction-management-container');
        if (transactionManagementContainer) {
            // Load transaction management
            fetch('/transactions.html')
                .then(response => response.text())
                .then(html => {
                    transactionManagementContainer.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading transaction management:', error);
                });
        }
    }
}

// Direct content loading for existing HTML structure
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
        console.log('User is logged in, loading content...');
        
        // Add event listener for hash changes to load content
        window.addEventListener('hashchange', loadContentForCurrentPage);
        
        // Load content for current page
        loadContentForCurrentPage();
    }
});

// Load content for current page based on URL hash
function loadContentForCurrentPage() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    console.log('Loading content for page:', hash);
    
    // Load content based on hash
    switch(hash) {
        case 'notification':
            loadNotificationContent();
            break;
        case 'draw':
            loadDrawContent();
            break;
        case 'user':
            loadUserContent();
            break;
        case 'transaction':
            loadTransactionContent();
            break;
        case 'dashboard':
        default:
            // Load dashboard content
            break;
    }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAdminPortal,
        initializeNotificationManagement,
        initializeDrawManagement,
        initializeUserManagement,
        initializeCSVUpload,
        initializeAdminCreation,
        createAdminUser,
        loadComponentContent,
        loadNotificationContent,
        loadDrawContent,
        loadUserContent,
        loadTransactionContent,
        loadContentForCurrentPage
    };
}

