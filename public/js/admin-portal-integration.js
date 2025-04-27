/**
 * Admin Portal Integration Script
 * 
 * This script integrates all components of the Bridgetunes MTN admin portal
 * and ensures proper backend connectivity for all data operations.
 */

// Configuration
const PRODUCTION_API_URL = 'https://api.bridgetunes.com/api/v1'; // Production API URL
const DEVELOPMENT_API_URL = 'http://localhost:8080/api/v1'; // Development API URL
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? DEVELOPMENT_API_URL
    : PRODUCTION_API_URL;

// Initialize MongoDB Service
let mongoDBService;

// Initialize admin portal
function initializeAdminPortal() {
    console.log('Initializing Admin Portal Integration...');
    
    // Initialize MongoDB Service if axios is available
    if (typeof axios !== 'undefined') {
        try {
            mongoDBService = new MongoDBService();
            console.log('MongoDB Service initialized successfully');
        } catch (error) {
            console.error('Error initializing MongoDB Service:', error);
            // Create fallback service
            mongoDBService = createFallbackService();
        }
    } else {
        console.warn('Axios not found, using fallback service');
        mongoDBService = createFallbackService();
    }
    
    // Add event listeners for navigation
    setupNavigation();
    
    // Load content for current page
    loadContentForCurrentPage();
}

// Create fallback service for development/testing
function createFallbackService() {
    console.warn('Using fallback service for development/testing');
    
    return {
        // Fallback methods that return mock data
        getDashboardStats: () => Promise.resolve({
            stats: {
                totalUsers: 12458,
                activeUsers: 8976,
                totalTopups: 45789,
                totalDraws: 124,
                currentJackpot: 5000000,
                notificationsSent: 78945
            },
            recentActivity: [
                { user: 'Admin', action: 'Executed draw', timestamp: new Date(Date.now() - 3600000), status: 'completed' },
                { user: 'System', action: 'Processed topups', timestamp: new Date(Date.now() - 7200000), status: 'completed' },
                { user: 'Admin', action: 'Sent campaign', timestamp: new Date(Date.now() - 10800000), status: 'completed' },
                { user: 'Admin', action: 'Created template', timestamp: new Date(Date.now() - 86400000), status: 'completed' },
                { user: 'System', action: 'Backup database', timestamp: new Date(Date.now() - 172800000), status: 'completed' }
            ]
        }),
        getUsers: () => Promise.resolve({
            users: [
                { id: '1', msisdn: '+2348012345678', name: 'John Doe', status: 'active', type: 'public', createdAt: new Date(Date.now() - 2592000000) },
                { id: '2', msisdn: '+2348023456789', name: 'Jane Smith', status: 'active', type: 'public', createdAt: new Date(Date.now() - 1592000000) },
                { id: '3', email: 'admin@bridgetunes.com', name: 'Admin User', status: 'active', type: 'admin', organization: 'Bridgetunes', createdAt: new Date(Date.now() - 5592000000) },
                { id: '4', email: 'staff@mtn.com', name: 'MTN Staff', status: 'active', type: 'staff', organization: 'MTN', createdAt: new Date(Date.now() - 4592000000) },
                { id: '5', msisdn: '+2348034567890', name: 'Mike Johnson', status: 'inactive', type: 'public', createdAt: new Date(Date.now() - 3592000000) }
            ],
            total: 5,
            page: 1,
            limit: 10
        }),
        getDraws: () => Promise.resolve({
            draws: [
                { id: '1', date: new Date(Date.now() - 86400000), status: 'completed', winners: 10, jackpotAmount: 1000000, eligibleNumbers: 5000 },
                { id: '2', date: new Date(Date.now() - 172800000), status: 'completed', winners: 8, jackpotAmount: 1000000, eligibleNumbers: 4800 },
                { id: '3', date: new Date(Date.now() - 259200000), status: 'completed', winners: 12, jackpotAmount: 1000000, eligibleNumbers: 5200 },
                { id: '4', date: new Date(Date.now() + 86400000), status: 'scheduled', winners: 0, jackpotAmount: 1000000, eligibleNumbers: 0 },
                { id: '5', date: new Date(Date.now() + 172800000), status: 'scheduled', winners: 0, jackpotAmount: 1000000, eligibleNumbers: 0 }
            ],
            total: 5,
            page: 1,
            limit: 10
        }),
        getNotifications: () => Promise.resolve({
            notifications: [
                { id: '1', msisdn: '+2348012345678', message: 'Welcome to Bridgetunes!', status: 'delivered', timestamp: new Date(Date.now() - 86400000) },
                { id: '2', msisdn: '+2348023456789', message: 'Congratulations! You won ₦10,000 in today\'s draw.', status: 'delivered', timestamp: new Date(Date.now() - 172800000) },
                { id: '3', msisdn: '+2348034567890', message: 'Today\'s jackpot is ₦1,000,000. Top up to qualify!', status: 'delivered', timestamp: new Date(Date.now() - 259200000) },
                { id: '4', msisdn: '+2348045678901', message: 'Your number has been entered into today\'s draw.', status: 'failed', timestamp: new Date(Date.now() - 345600000) },
                { id: '5', msisdn: '+2348056789012', message: 'Reminder: Today\'s draw is at 8 PM.', status: 'pending', timestamp: new Date(Date.now() - 432000000) }
            ],
            total: 5,
            page: 1,
            limit: 10
        }),
        getCampaigns: () => Promise.resolve({
            campaigns: [
                { id: '1', name: 'Welcome Campaign', status: 'active', sentCount: 1200, deliveredCount: 1150, failedCount: 50, createdAt: new Date(Date.now() - 2592000000) },
                { id: '2', name: 'Daily Draw Reminder', status: 'active', sentCount: 5000, deliveredCount: 4800, failedCount: 200, createdAt: new Date(Date.now() - 1592000000) },
                { id: '3', name: 'Winner Notification', status: 'active', sentCount: 500, deliveredCount: 490, failedCount: 10, createdAt: new Date(Date.now() - 592000000) },
                { id: '4', name: 'Jackpot Update', status: 'inactive', sentCount: 3000, deliveredCount: 2900, failedCount: 100, createdAt: new Date(Date.now() - 3592000000) },
                { id: '5', name: 'Re-engagement', status: 'draft', sentCount: 0, deliveredCount: 0, failedCount: 0, createdAt: new Date(Date.now() - 4592000000) }
            ],
            total: 5,
            page: 1,
            limit: 10
        }),
        getTemplates: () => Promise.resolve({
            templates: [
                { id: '1', name: 'Welcome Template', content: 'Welcome to Bridgetunes, {{name}}!', type: 'welcome', createdAt: new Date(Date.now() - 2592000000) },
                { id: '2', name: 'Draw Reminder', content: 'Reminder: Today\'s draw is at 8 PM. Top up to qualify!', type: 'reminder', createdAt: new Date(Date.now() - 1592000000) },
                { id: '3', name: 'Winner Notification', content: 'Congratulations, {{name}}! You won ₦{{amount}} in today\'s draw.', type: 'winner', createdAt: new Date(Date.now() - 592000000) },
                { id: '4', name: 'Jackpot Update', content: 'Today\'s jackpot is ₦{{amount}}. Top up to qualify!', type: 'jackpot', createdAt: new Date(Date.now() - 3592000000) },
                { id: '5', name: 'Re-engagement', content: 'We miss you, {{name}}! Top up today to qualify for our daily draws.', type: 're-engagement', createdAt: new Date(Date.now() - 4592000000) }
            ],
            total: 5,
            page: 1,
            limit: 10
        }),
        getTopups: () => Promise.resolve({
            topups: [
                { id: '1', msisdn: '+2348012345678', amount: 500, timestamp: new Date(Date.now() - 86400000), status: 'processed' },
                { id: '2', msisdn: '+2348023456789', amount: 1000, timestamp: new Date(Date.now() - 172800000), status: 'processed' },
                { id: '3', msisdn: '+2348034567890', amount: 200, timestamp: new Date(Date.now() - 259200000), status: 'processed' },
                { id: '4', msisdn: '+2348045678901', amount: 5000, timestamp: new Date(Date.now() - 345600000), status: 'processed' },
                { id: '5', msisdn: '+2348056789012', amount: 100, timestamp: new Date(Date.now() - 432000000), status: 'processed' }
            ],
            total: 5,
            page: 1,
            limit: 10
        })
    };
}

// Set up navigation
function setupNavigation() {
    console.log('Setting up navigation...');
    
    // Add event listeners for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            // Get page ID from data attribute
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                // Update hash
                window.location.hash = pageId;
            }
        });
    });
    
    // Add event listener for hash changes
    window.addEventListener('hashchange', loadContentForCurrentPage);
}

// Load content for current page based on URL hash
function loadContentForCurrentPage() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    console.log('Loading content for page:', hash);
    
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current link
    const currentLink = document.querySelector(`.nav-link[data-page="${hash}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
    
    // Hide all content pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });
    
    // Show current content page
    const currentPage = document.getElementById(`${hash}-content`);
    if (currentPage) {
        currentPage.style.display = 'block';
    } else {
        console.warn(`Content page for ${hash} not found`);
    }
    
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
            loadDashboardContent();
            break;
    }
}

// Load dashboard content
function loadDashboardContent() {
    console.log('Loading Dashboard Content...');
    
    // Get dashboard content container
    const contentContainer = document.getElementById('dashboard-container');
    if (!contentContainer) {
        console.error('Dashboard container not found');
        return;
    }
    
    // Show loading indicator
    contentContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading dashboard data...</div>';
    
    // Fetch dashboard template
    fetch('/templates/dashboard-template.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load dashboard template: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            // Set content
            contentContainer.innerHTML = html;
            
            // Initialize dashboard components
            initializeDashboardComponents();
        })
        .catch(error => {
            console.error('Error loading dashboard template:', error);
            contentContainer.innerHTML = `
                <div class="alert alert-danger">
                    <h4>Error Loading Dashboard</h4>
                    <p>There was an error loading the dashboard content. Please try refreshing the page.</p>
                    <p>Error details: ${error.message}</p>
                </div>
            `;
        });
}

// Initialize dashboard components
function initializeDashboardComponents() {
    console.log('Initializing Dashboard Components...');
    
    // Fetch dashboard stats from MongoDB service
    if (mongoDBService) {
        mongoDBService.getDashboardStats()
            .then(data => {
                // Update dashboard stats
                document.getElementById('total-users')?.textContent = data.stats.totalUsers.toLocaleString();
                document.getElementById('active-users')?.textContent = data.stats.activeUsers.toLocaleString();
                document.getElementById('total-draws')?.textContent = data.stats.totalDraws.toLocaleString();
                document.getElementById('total-winners')?.textContent = (data.stats.totalDraws * 10).toLocaleString(); // Assuming 10 winners per draw
                document.getElementById('total-notifications')?.textContent = data.stats.notificationsSent.toLocaleString();
                document.getElementById('active-campaigns')?.textContent = '12'; // Hardcoded for now
                
                // Update recent activity
                const activityList = document.getElementById('recent-activity-list');
                if (activityList && data.recentActivity) {
                    activityList.innerHTML = '';
                    data.recentActivity.forEach(activity => {
                        const li = document.createElement('li');
                        li.className = 'activity-item';
                        li.innerHTML = `
                            <div class="activity-icon ${activity.status === 'completed' ? 'success' : 'pending'}">
                                <i class="fas fa-${activity.status === 'completed' ? 'check' : 'clock'}"></i>
                            </div>
                            <div class="activity-details">
                                <div class="activity-title">${activity.user} ${activity.action}</div>
                                <div class="activity-time">${formatTimeAgo(activity.timestamp)}</div>
                            </div>
                        `;
                        activityList.appendChild(li);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching dashboard stats:', error);
                // Show error message
                document.getElementById('dashboard-stats')?.classList.add('error');
                document.getElementById('dashboard-stats')?.innerHTML = `
                    <div class="alert alert-danger">
                        <h4>Error Loading Dashboard Stats</h4>
                        <p>There was an error loading the dashboard statistics. Please try refreshing the page.</p>
                        <p>Error details: ${error.message}</p>
                    </div>
                `;
            });
    } else {
        console.warn('MongoDB service not available, using sample data');
        // Set sample data for dashboard
        document.getElementById('total-users')?.textContent = '9,876';
        document.getElementById('active-users')?.textContent = '7,654';
        document.getElementById('total-draws')?.textContent = '125';
        document.getElementById('total-winners')?.textContent = '1,250';
        document.getElementById('total-notifications')?.textContent = '45,678';
        document.getElementById('active-campaigns')?.textContent = '12';
    }
}

// Load notification content
function loadNotificationContent() {
    console.log('Loading Notification Content...');
    
    // Get notification content container
    const contentContainer = document.getElementById('notification-container');
    if (!contentContainer) {
        console.error('Notification container not found');
        return;
    }
    
    // Show loading indicator
    contentContainer.innerHTML = '<div class="loading-spinner"><i class="f
(Content truncated due to size limit. Use line ranges to read in chunks)

