// Admin Portal Integration
// This file integrates all components of the admin portal with the backend

// Configuration
const PRODUCTION_API_URL = 'https://api.bridgetunes.com/api/v1'; // Production API URL
const DEVELOPMENT_API_URL = 'http://localhost:8080/api/v1'; // Development API URL
const API_URL = window.location.hostname === 'localhost' ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;

// Initialize admin portal components
function initializeAdminPortal() {
    console.log('Initializing Admin Portal Components...');
    
    // Initialize MongoDB service
    if (typeof initializeMongoDBService === 'function') {
        initializeMongoDBService(API_URL);
    }
    
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
    
    // Get notification content container
    const notificationContent = document.getElementById('notification-content');
    if (!notificationContent) return;
    
    // Check if notification management service is available
    if (typeof NotificationManagementService !== 'undefined') {
        // Initialize notification management service
        const notificationService = new NotificationManagementService(API_URL);
        
        // Load notification templates
        notificationService.loadTemplates()
            .then(templates => {
                console.log('Notification Templates Loaded:', templates);
            })
            .catch(error => {
                console.error('Error loading notification templates:', error);
            });
        
        // Load user segments
        notificationService.loadUserSegments()
            .then(segments => {
                console.log('User Segments Loaded:', segments);
            })
            .catch(error => {
                console.error('Error loading user segments:', error);
            });
        
        // Load campaigns
        notificationService.loadCampaigns()
            .then(campaigns => {
                console.log('Campaigns Loaded:', campaigns);
            })
            .catch(error => {
                console.error('Error loading campaigns:', error);
            });
    }
}

// Initialize draw management
function initializeDrawManagement() {
    console.log('Initializing Draw Management...');
    
    // Get draw content container
    const drawContent = document.getElementById('draw-content');
    if (!drawContent) return;
    
    // Check if draw management service is available
    if (typeof DrawManagementService !== 'undefined') {
        // Initialize draw management service
        const drawService = new DrawManagementService(API_URL);
        
        // Load draw history
        drawService.loadDrawHistory()
            .then(history => {
                console.log('Draw History Loaded:', history);
            })
            .catch(error => {
                console.error('Error loading draw history:', error);
            });
        
        // Load jackpot information
        drawService.loadJackpotInfo()
            .then(jackpot => {
                console.log('Jackpot Info Loaded:', jackpot);
            })
            .catch(error => {
                console.error('Error loading jackpot info:', error);
            });
    }
}

// Initialize user management
function initializeUserManagement() {
    console.log('Initializing User Management...');
    
    // Get user content container
    const userContent = document.getElementById('user-content');
    if (!userContent) return;
    
    // Check if user management service is available
    if (typeof UserManagementService !== 'undefined') {
        // Initialize user management service
        const userService = new UserManagementService(API_URL);
        
        // Load users
        userService.loadUsers()
            .then(users => {
                console.log('Users Loaded:', users);
            })
            .catch(error => {
                console.error('Error loading users:', error);
            });
    }
}

// Initialize CSV upload
function initializeCSVUpload() {
    console.log('Initializing CSV Upload...');
    
    // Check if CSV upload service is available
    if (typeof CSVUploadService !== 'undefined') {
        // Initialize CSV upload service
        const csvService = new CSVUploadService(API_URL);
    }
}

// Initialize admin creation
function initializeAdminCreation() {
    console.log('Initializing Admin Creation...');
    
    // Get settings content container
    const settingContent = document.getElementById('setting-content');
    if (!settingContent) return;
    
    // Create admin creation form if it doesn't exist
    if (!document.getElementById('admin-creation-form')) {
        // Create form container
        const formContainer = document.createElement('div');
        formContainer.className = 'card';
        formContainer.innerHTML = `
            <div class="card-header">
                <h2 class="card-title">Create Admin User</h2>
            </div>
            <div class="card-body">
                <form id="admin-creation-form" class="form">
                    <div class="form-group">
                        <label for="admin-name">Name</label>
                        <input type="text" id="admin-name" name="name" class="form-control" placeholder="Enter name" required>
                    </div>
                    <div class="form-group">
                        <label for="admin-email">Email</label>
                        <input type="email" id="admin-email" name="email" class="form-control" placeholder="Enter email" required>
                    </div>
                    <div class="form-group">
                        <label for="admin-password">Password</label>
                        <input type="password" id="admin-password" name="password" class="form-control" placeholder="Enter password" required>
                    </div>
                    <div class="form-group">
                        <label for="admin-type">Type</label>
                        <select id="admin-type" name="type" class="form-control" required>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>
                    <div class="form-group" id="organization-group" style="display: none;">
                        <label for="admin-organization">Organization</label>
                        <select id="admin-organization" name="organization" class="form-control">
                            <option value="Bridgetunes">Bridgetunes</option>
                            <option value="MTN">MTN</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Create Admin</button>
                    </div>
                </form>
            </div>
        `;
        
        // Add form to settings content
        settingContent.appendChild(formContainer);
        
        // Add event listener for admin type change
        const adminType = document.getElementById('admin-type');
        const organizationGroup = document.getElementById('organization-group');
        
        if (adminType && organizationGroup) {
            adminType.addEventListener('change', function() {
                if (this.value === 'staff') {
                    organizationGroup.style.display = 'block';
                } else {
                    organizationGroup.style.display = 'none';
                }
            });
        }
        
        // Add event listener for form submission
        const adminCreationForm = document.getElementById('admin-creation-form');
        if (adminCreationForm) {
            adminCreationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const name = document.getElementById('admin-name').value;
                const email = document.getElementById('admin-email').value;
                const password = document.getElementById('admin-password').value;
                const type = document.getElementById('admin-type').value;
                const organization = type === 'staff' ? document.getElementById('admin-organization').value : '';
                
                // Create admin user
                createAdminUser(name, email, password, type, organization);
            });
        }
    }
}

// Create admin user
function createAdminUser(name, email, password, type, organization) {
    console.log('Creating Admin User:', { name, email, type, organization });
    
    // Get admin users from localStorage
    const adminUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
    
    // Check if email already exists
    if (adminUsers.some(user => user.email === email)) {
        alert('Email already exists. Please use a different email.');
        return;
    }
    
    // Create new admin user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        type,
        organization: type === 'staff' ? organization : '',
        createdAt: new Date().toISOString()
    };
    
    // Add new user to admin users
    adminUsers.push(newUser);
    
    // Save admin users to localStorage
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
    if (!notificationContent) return;
    
    // Clear existing content
    notificationContent.innerHTML = `
        <div class="page-header">
            <h1>Notification Management</h1>
        </div>
        <div class="notification-tabs">
            <ul class="nav-tabs">
                <li class="nav-tab active" data-tab="templates">Templates</li>
                <li class="nav-tab" data-tab="segments">User Segments</li>
                <li class="nav-tab" data-tab="campaigns">Campaigns</li>
                <li class="nav-tab" data-tab="logs">Logs</li>
            </ul>
        </div>
        <div class="tab-content">
            <div id="templates-tab" class="tab-pane active">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Notification Templates</h2>
                        <button class="btn btn-primary" id="add-template-btn">
                            <i class="fas fa-plus"></i> Add Template
                        </button>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Content</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="templates-table-body">
                                <tr>
                                    <td>Welcome Message</td>
                                    <td>SMS</td>
                                    <td>Welcome to Bridgetunes! Your number {{msisdn}} is now registered.</td>
                                    <td>2023-04-15</td>
                                    <td>
                                        <button class="btn btn-icon btn-edit">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-icon btn-delete">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Draw Reminder</td>
                                    <td>SMS</td>
                                    <td>Don't forget! The next draw is tomorrow at 8PM. Current jackpot: ₦{{jackpot_amount}}.</td>
                                    <td>2023-04-16</td>
                                    <td>
                                        <button class="btn btn-icon btn-edit">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-icon btn-delete">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div id="segments-tab" class="tab-pane">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">User Segments</h2>
                        <button class="btn btn-primary" id="add-segment-btn">
                            <i class="fas fa-plus"></i> Add Segment
                        </button>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Criteria</th>
                                    <th>User Count</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="segments-table-body">
                                <tr>
                                    <td>High Value Users</td>
                                    <td>Top-up > ₦1,000</td>
                                    <td>1,245</td>
                                    <td>2023-04-15</td>
                                    <td>
                                        <button class="btn btn-icon btn-edit">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-icon btn-delete">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                            
(Content truncated due to size limit. Use line ranges to read in chunks)
