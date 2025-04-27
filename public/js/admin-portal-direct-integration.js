// Admin Portal Direct Integration Script
// This file directly injects HTML templates into the admin portal

// Configuration
const PRODUCTION_API_URL = 'https://api.bridgetunes.com/api/v1'; // Production API URL
const DEVELOPMENT_API_URL = 'http://localhost:8080/api/v1'; // Development API URL
const API_URL = window.location.hostname === 'localhost' ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;

// Initialize admin portal
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Admin Portal Direct Integration...');
    
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
        console.log('User is authenticated, initializing components...');
        
        // Add event listener for navigation links
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
        
        // Load content for current page
        loadContentForCurrentPage();
    }
});

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
    const contentContainer = document.querySelector('.page-content:not([style*="display: none"])') || document.getElementById('dashboard-content');
    if (contentContainer) {
        // Fetch dashboard template
        fetch('/templates/dashboard-template.html')
            .then(response => response.text())
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
    } else {
        console.error('Dashboard content container not found');
    }
}

// Load notification content
function loadNotificationContent() {
    console.log('Loading Notification Content...');
    
    // Get notification content container
    const contentContainer = document.querySelector('.page-content:not([style*="display: none"])') || document.getElementById('notification-content');
    if (contentContainer) {
        // Fetch notification template
        fetch('/templates/notification-template.html')
            .then(response => response.text())
            .then(html => {
                // Set content
                contentContainer.innerHTML = html;
                
                // Initialize notification components
                initializeNotificationComponents();
            })
            .catch(error => {
                console.error('Error loading notification template:', error);
                contentContainer.innerHTML = `
                    <div class="alert alert-danger">
                        <h4>Error Loading Notification Management</h4>
                        <p>There was an error loading the notification management content. Please try refreshing the page.</p>
                        <p>Error details: ${error.message}</p>
                    </div>
                `;
            });
    } else {
        console.error('Notification content container not found');
    }
}

// Load draw content
function loadDrawContent() {
    console.log('Loading Draw Content...');
    
    // Get draw content container
    const contentContainer = document.querySelector('.page-content:not([style*="display: none"])') || document.getElementById('draw-content');
    if (contentContainer) {
        // Fetch draw template
        fetch('/templates/draw-template.html')
            .then(response => response.text())
            .then(html => {
                // Set content
                contentContainer.innerHTML = html;
                
                // Initialize draw components
                initializeDrawComponents();
            })
            .catch(error => {
                console.error('Error loading draw template:', error);
                contentContainer.innerHTML = `
                    <div class="alert alert-danger">
                        <h4>Error Loading Draw Management</h4>
                        <p>There was an error loading the draw management content. Please try refreshing the page.</p>
                        <p>Error details: ${error.message}</p>
                    </div>
                `;
            });
    } else {
        console.error('Draw content container not found');
    }
}

// Load user content
function loadUserContent() {
    console.log('Loading User Content...');
    
    // Get user content container
    const contentContainer = document.querySelector('.page-content:not([style*="display: none"])') || document.getElementById('user-content');
    if (contentContainer) {
        // Fetch user template
        fetch('/templates/user-template.html')
            .then(response => response.text())
            .then(html => {
                // Set content
                contentContainer.innerHTML = html;
                
                // Initialize user components
                initializeUserComponents();
            })
            .catch(error => {
                console.error('Error loading user template:', error);
                contentContainer.innerHTML = `
                    <div class="alert alert-danger">
                        <h4>Error Loading User Management</h4>
                        <p>There was an error loading the user management content. Please try refreshing the page.</p>
                        <p>Error details: ${error.message}</p>
                    </div>
                `;
            });
    } else {
        console.error('User content container not found');
    }
}

// Load transaction content
function loadTransactionContent() {
    console.log('Loading Transaction Content...');
    
    // Get transaction content container
    const contentContainer = document.querySelector('.page-content:not([style*="display: none"])') || document.getElementById('transaction-content');
    if (contentContainer) {
        // Fetch transaction template
        fetch('/templates/transaction-template.html')
            .then(response => response.text())
            .then(html => {
                // Set content
                contentContainer.innerHTML = html;
                
                // Initialize transaction components
                initializeTransactionComponents();
            })
            .catch(error => {
                console.error('Error loading transaction template:', error);
                contentContainer.innerHTML = `
                    <div class="alert alert-danger">
                        <h4>Error Loading Transaction Management</h4>
                        <p>There was an error loading the transaction management content. Please try refreshing the page.</p>
                        <p>Error details: ${error.message}</p>
                    </div>
                `;
            });
    } else {
        console.error('Transaction content container not found');
    }
}

// Initialize dashboard components
function initializeDashboardComponents() {
    console.log('Initializing Dashboard Components...');
    
    // Set sample data for dashboard
    document.getElementById('total-users')?.textContent = '9,876';
    document.getElementById('active-users')?.textContent = '7,654';
    document.getElementById('total-draws')?.textContent = '125';
    document.getElementById('total-winners')?.textContent = '1,250';
    document.getElementById('total-notifications')?.textContent = '45,678';
    document.getElementById('active-campaigns')?.textContent = '12';
    
    // Add event listeners for dashboard components
    // ...
}

// Initialize notification components
function initializeNotificationComponents() {
    console.log('Initializing Notification Components...');
    
    // Add event listeners for notification components
    document.getElementById('create-campaign-btn')?.addEventListener('click', function() {
        alert('Create Campaign functionality will be implemented in the next phase.');
    });
    
    document.getElementById('create-template-btn')?.addEventListener('click', function() {
        alert('Create Template functionality will be implemented in the next phase.');
    });
    
    document.getElementById('create-segment-btn')?.addEventListener('click', function() {
        alert('Create Segment functionality will be implemented in the next phase.');
    });
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.btn-info, .btn-danger').forEach(button => {
        button.addEventListener('click', function() {
            alert('This functionality will be implemented in the next phase.');
        });
    });
}

// Initialize draw components
function initializeDrawComponents() {
    console.log('Initializing Draw Components...');
    
    // Add event listener for filter type change
    const filterType = document.getElementById('filter-type');
    const endingDigitsContainer = document.getElementById('ending-digits-container');
    
    if (filterType && endingDigitsContainer) {
        filterType.addEventListener('change', function() {
            if (this.value === 'ending') {
                endingDigitsContainer.style.display = 'block';
            } else {
                endingDigitsContainer.style.display = 'none';
            }
        });
    }
    
    // Add event listeners for draw buttons
    document.getElementById('run-draw-btn')?.addEventListener('click', function() {
        alert('Run Draw functionality will be implemented in the next phase.');
    });
    
    document.getElementById('preview-eligible-btn')?.addEventListener('click', function() {
        alert('Preview Eligible Numbers functionality will be implemented in the next phase.');
    });
    
    // Add event listeners for jackpot configuration form
    document.getElementById('jackpot-config-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Jackpot Configuration saved successfully!');
    });
    
    // Add event listeners for rollover configuration form
    document.getElementById('rollover-config-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Rollover Configuration saved successfully!');
    });
    
    // Add event listener for rollover percentage slider
    const rolloverPercentage = document.getElementById('rollover-percentage');
    const rolloverPercentageValue = document.getElementById('rollover-percentage-value');
    
    if (rolloverPercentage && rolloverPercentageValue) {
        rolloverPercentage.addEventListener('input', function() {
            rolloverPercentageValue.textContent = this.value + '%';
        });
    }
}

// Initialize user components
function initializeUserComponents() {
    console.log('Initializing User Components...');
    
    // Add event listener for create user button
    document.getElementById('create-user-btn')?.addEventListener('click', function() {
        // Show user modal
        const userModal = new bootstrap.Modal(document.getElementById('user-modal'));
        userModal.show();
    });
    
    // Add event listener for user type change
    const userType = document.getElementById('user-type');
    const organizationField = document.getElementById('organization-field');
    const msisdnField = document.getElementById('msisdn-field');
    
    if (userType && organizationField && msisdnField) {
        userType.addEventListener('change', function() {
            if (this.value === 'staff') {
                organizationField.style.display = 'block';
                msisdnField.style.display = 'none';
            } else if (this.value === 'public') {
                organizationField.style.display = 'none';
                msisdnField.style.display = 'block';
            } else {
                organizationField.style.display = 'none';
                msisdnField.style.display = 'none';
            }
        });
    }
    
    // Add event listener for save user button
    document.getElementById('save-user-btn')?.addEventListener('click', function() {
        alert('User saved successfully!');
        // Hide user modal
        const userModal = bootstrap.Modal.getInstance(document.getElementById('user-modal'));
        userModal.hide();
    });
    
    // Add event listeners for user actions
    document.querySelectorAll('.btn-info, .btn-warning, .btn-success').forEach(button => {
        button.addEventListener('click', function() {
            alert('This functionality will be implemented in the next phase.');
        });
    });
}

// Initialize transaction components
function initializeTransactionComponents() {
    console.log('Initializing Transaction Components...');
    
    // Add event listener for export button
    document.getElementById('export-transactions-btn')?.addEventListener('click', function() {
        alert('Export functionality will be implemented in the next phase.');
    });
    
    // Add event listeners for transaction actions
    document.querySelectorAll('.btn-info').forEach(button => {
        button.addEventListener('click', function() {
            alert('This functionality will be implemented in the next phase.');
        });
    });
    
    // Set current date for date filters
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const dateFrom = document.getElementById('transaction-date-from');
    const dateTo = document.getElementById('transaction-date-to');
    
    if (dateFrom && dateTo) {
        dateFrom.valueAsDate = lastMonth;
        dateTo.valueAsDate = today;
    }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadContentForCurrentPage,
        loadDashboardContent,
        loadNotificationContent,
        loadDrawContent,
        loadUserContent,
        loadTransactionContent,
        initializeDashboardComponents,
        initializeNotificationComponents,
        initializeDrawComponents,
        initializeUserComponents,
        initializeTransactionComponents
    };
}
