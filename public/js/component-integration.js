/**
 * Component Integration Module for Bridgetunes MTN Admin Portal
 * 
 * This module connects all UI components to the backend services,
 * ensuring proper data flow and functionality throughout the portal.
 */

// Initialize component integration
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Component Integration...');
    
    // Check if user is authenticated
    const token = localStorage.getItem('bridgetunes_auth_token');
    if (token) {
        console.log('User is authenticated, initializing components...');
        
        // Initialize backend integration if not already initialized
        if (typeof window.backendService === 'undefined') {
            console.warn('Backend service not found, loading backend integration...');
            loadScript('js/backend-integration-fixed.js', function() {
                initializeComponents();
            });
        } else {
            initializeComponents();
        }
    } else {
        console.log('User is not authenticated, waiting for login...');
    }
});

/**
 * Initialize all components
 */
function initializeComponents() {
    console.log('Initializing all components...');
    
    // Initialize notification management component
    initializeNotificationManagement();
    
    // Initialize draw management component
    initializeDrawManagement();
    
    // Initialize user management component
    initializeUserManagement();
    
    // Initialize transaction management component
    initializeTransactionManagement();
    
    // Add event listeners for navigation
    setupNavigation();
}

/**
 * Initialize notification management component
 */
function initializeNotificationManagement() {
    console.log('Initializing Notification Management Component...');
    
    // Check if notification management service is available
    if (typeof NotificationManagementService !== 'undefined') {
        try {
            // Initialize notification management service
            const notificationService = new NotificationManagementService(window.backendService);
            
            // Make service globally available
            window.notificationService = notificationService;
            
            console.log('Notification Management Service initialized successfully');
            
            // Add event listeners for notification management components
            document.getElementById('create-campaign-btn')?.addEventListener('click', function() {
                notificationService.showCreateCampaignModal();
            });
            
            document.getElementById('create-template-btn')?.addEventListener('click', function() {
                notificationService.showCreateTemplateModal();
            });
            
            document.getElementById('create-segment-btn')?.addEventListener('click', function() {
                notificationService.showCreateSegmentModal();
            });
            
            // Load notification data when notification tab is clicked
            document.querySelector('.nav-link[data-page="notification"]')?.addEventListener('click', function() {
                notificationService.loadNotificationData();
            });
        } catch (error) {
            console.error('Error initializing Notification Management Service:', error);
        }
    } else {
        console.warn('Notification Management Service not found');
    }
}

/**
 * Initialize draw management component
 */
function initializeDrawManagement() {
    console.log('Initializing Draw Management Component...');
    
    // Check if draw management service is available
    if (typeof DrawManagementService !== 'undefined') {
        try {
            // Initialize draw management service
            const drawService = new DrawManagementService(window.backendService);
            
            // Make service globally available
            window.drawService = drawService;
            
            console.log('Draw Management Service initialized successfully');
            
            // Add event listeners for draw management components
            document.getElementById('run-draw-btn')?.addEventListener('click', function() {
                drawService.showRunDrawModal();
            });
            
            document.getElementById('preview-eligible-btn')?.addEventListener('click', function() {
                drawService.previewEligibleNumbers();
            });
            
            // Load draw data when draw tab is clicked
            document.querySelector('.nav-link[data-page="draw"]')?.addEventListener('click', function() {
                drawService.loadDrawData();
            });
        } catch (error) {
            console.error('Error initializing Draw Management Service:', error);
        }
    } else {
        console.warn('Draw Management Service not found');
    }
}

/**
 * Initialize user management component
 */
function initializeUserManagement() {
    console.log('Initializing User Management Component...');
    
    // Check if user management service is available
    if (typeof UserManagementService !== 'undefined') {
        try {
            // Initialize user management service
            const userService = new UserManagementService(window.backendService);
            
            // Make service globally available
            window.userService = userService;
            
            console.log('User Management Service initialized successfully');
            
            // Add event listeners for user management components
            document.getElementById('create-user-btn')?.addEventListener('click', function() {
                userService.showCreateUserModal();
            });
            
            // Load user data when user tab is clicked
            document.querySelector('.nav-link[data-page="user"]')?.addEventListener('click', function() {
                userService.loadUserData();
            });
        } catch (error) {
            console.error('Error initializing User Management Service:', error);
        }
    } else {
        console.warn('User Management Service not found');
    }
}

/**
 * Initialize transaction management component
 */
function initializeTransactionManagement() {
    console.log('Initializing Transaction Management Component...');
    
    // Check if MongoDB service is available
    if (typeof window.backendService !== 'undefined') {
        try {
            // Add event listeners for transaction management components
            document.getElementById('export-transactions-btn')?.addEventListener('click', function() {
                exportTransactions();
            });
            
            // Load transaction data when transaction tab is clicked
            document.querySelector('.nav-link[data-page="transaction"]')?.addEventListener('click', function() {
                loadTransactionData();
            });
            
            console.log('Transaction Management Component initialized successfully');
        } catch (error) {
            console.error('Error initializing Transaction Management Component:', error);
        }
    } else {
        console.warn('Backend Service not found');
    }
}

/**
 * Load transaction data
 */
function loadTransactionData() {
    console.log('Loading Transaction Data...');
    
    const transactionsTableBody = document.getElementById('transactions-table-body');
    if (!transactionsTableBody) {
        console.warn('Transactions table body not found');
        return;
    }
    
    // Show loading indicator
    transactionsTableBody.innerHTML = '<tr><td colspan="5" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading transactions...</td></tr>';
    
    // Get date range
    const dateFrom = document.getElementById('transaction-date-from')?.value || '';
    const dateTo = document.getElementById('transaction-date-to')?.value || '';
    
    // Fetch transactions from backend
    window.backendService.get(`/topups?startDate=${dateFrom}&endDate=${dateTo}&page=1&limit=10`)
        .then(data => {
            if (data && data.topups && data.topups.length > 0) {
                // Clear loading indicator
                transactionsTableBody.innerHTML = '';
                
                // Add transactions to table
                data.topups.forEach(topup => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${topup.msisdn}</td>
                        <td>₦${topup.amount.toLocaleString()}</td>
                        <td>${formatDate(topup.timestamp)}</td>
                        <td><span class="badge bg-${topup.status === 'processed' ? 'success' : 'warning'}">${topup.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-info view-transaction-btn" data-id="${topup.id}"><i class="fas fa-eye"></i></button>
                        </td>
                    `;
                    transactionsTableBody.appendChild(tr);
                });
                
                // Add event listeners for view buttons
                document.querySelectorAll('.view-transaction-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        viewTransaction(id);
                    });
                });
            } else {
                transactionsTableBody.innerHTML = '<tr><td colspan="5" class="text-center">No transactions found</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error loading transactions:', error);
            transactionsTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error loading transactions: ${error.message}</td></tr>`;
        });
}

/**
 * View transaction details
 * @param {string} id - Transaction ID
 */
function viewTransaction(id) {
    console.log('Viewing Transaction:', id);
    
    // Show loading modal
    const modalHtml = `
        <div class="modal fade" id="transaction-modal" tabindex="-1" aria-labelledby="transaction-modal-label" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="transaction-modal-label">Transaction Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center">
                            <i class="fas fa-spinner fa-spin"></i> Loading transaction details...
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body if it doesn't exist
    if (!document.getElementById('transaction-modal')) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
    }
    
    // Show modal
    const transactionModal = new bootstrap.Modal(document.getElementById('transaction-modal'));
    transactionModal.show();
    
    // Fetch transaction details from backend
    window.backendService.get(`/topups/${id}`)
        .then(data => {
            if (data) {
                // Update modal content
                document.querySelector('#transaction-modal .modal-body').innerHTML = `
                    <div class="transaction-details">
                        <div class="mb-3">
                            <strong>ID:</strong> ${data.id}
                        </div>
                        <div class="mb-3">
                            <strong>MSISDN:</strong> ${data.msisdn}
                        </div>
                        <div class="mb-3">
                            <strong>Amount:</strong> ₦${data.amount.toLocaleString()}
                        </div>
                        <div class="mb-3">
                            <strong>Date:</strong> ${formatDate(data.timestamp)}
                        </div>
                        <div class="mb-3">
                            <strong>Status:</strong> <span class="badge bg-${data.status === 'processed' ? 'success' : 'warning'}">${data.status}</span>
                        </div>
                        <div class="mb-3">
                            <strong>Commission:</strong> ₦${calculateCommission(data.amount)}
                        </div>
                    </div>
                `;
            } else {
                document.querySelector('#transaction-modal .modal-body').innerHTML = '<div class="alert alert-danger">Transaction not found</div>';
            }
        })
        .catch(error => {
            console.error('Error loading transaction details:', error);
            document.querySelector('#transaction-modal .modal-body').innerHTML = `<div class="alert alert-danger">Error loading transaction details: ${error.message}</div>`;
        });
}

/**
 * Export transactions
 */
function exportTransactions() {
    console.log('Exporting Transactions...');
    
    // Get date range
    const dateFrom = document.getElementById('transaction-date-from')?.value || '';
    const dateTo = document.getElementById('transaction-date-to')?.value || '';
    
    // Show loading toast
    showToast('Exporting transactions...', 'info');
    
    // Fetch transactions from backend
    window.backendService.get(`/topups?startDate=${dateFrom}&endDate=${dateTo}&page=1&limit=1000`)
        .then(data => {
            if (data && data.topups && data.topups.length > 0) {
                // Convert to CSV
                const csv = convertToCSV(data.topups);
                
                // Download CSV
                downloadCSV(csv, `transactions_${dateFrom}_to_${dateTo}.csv`);
                
                // Show success toast
                showToast('Transactions exported successfully!', 'success');
            } else {
                showToast('No transactions found to export', 'warning');
            }
        })
        .catch(error => {
            console.error('Error exporting transactions:', error);
            showToast(`Error exporting transactions: ${error.message}`, 'danger');
        });
}

/**
 * Convert data to CSV
 * @param {Array} data - Data to convert
 * @returns {string} CSV string
 */
function convertToCSV(data) {
    const headers = ['ID', 'MSISDN', 'Amount', 'Date', 'Status', 'Commission'];
    const rows = data.map(item => [
        item.id,
        item.msisdn,
        item.amount,
        formatDate(item.timestamp),
        item.status,
        calculateCommission(item.amount)
    ]);
    
    // Add headers
    const csv = [headers.join(',')];
    
    // Add rows
    rows.forEach(row => {
        csv.push(row.join(','));
    });
    
    return csv.join('\n');
}

/**
 * Download CSV file
 * @param {string} csv - CSV content
 * @param {string} filename - File name
 */
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Calculate commission based on top-up amount
 * @param {number} amount - Top-up amount
 * @returns {number} Commission amount
 */
function calculateCommission(amount) {
    if (amount >= 1000) {
        
(Content truncated due to size limit. Use line ranges to read in chunks)
