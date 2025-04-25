// Global variables
const API_BASE_URL = 'https://bridgetunes-mtn-backend.onrender.com/api';
let currentUser = null;
let authToken = null;
let currentPage = 'dashboard';
let transactionsPage = 1;
let transactionsPerPage = 10;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        // User is logged in
        authToken = token;
        currentUser = JSON.parse(user);
        showLoggedInUI();
        loadDashboard();
    } else {
        // User is not logged in
        showLoginUI();
    }
    
    // Set up event listeners
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Auth event listeners
    if (document.getElementById('login-form')) {
        document.getElementById('login-form').addEventListener('submit', handleLogin);
    }
    
    if (document.getElementById('register-form')) {
        document.getElementById('register-form').addEventListener('submit', handleRegister);
    }
    
    // Logout event listener
    if (document.getElementById('logout-link')) {
        document.getElementById('logout-link').addEventListener('click', handleLogout);
    }
    
    // Admin creation
    if (document.getElementById('create-admin-btn')) {
        document.getElementById('create-admin-btn').addEventListener('click', showCreateAdminModal);
    }
    
    if (document.getElementById('create-admin-submit')) {
        document.getElementById('create-admin-submit').addEventListener('click', handleCreateAdmin);
    }
    
    // Password reset
    if (document.getElementById('forgot-password-link')) {
        document.getElementById('forgot-password-link').addEventListener('click', showForgotPasswordForm);
    }
    
    if (document.getElementById('reset-password-form')) {
        document.getElementById('reset-password-form').addEventListener('submit', handlePasswordReset);
    }
}

// Authentication functions
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');
    
    try {
        errorElement.style.display = 'none';
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        // Store auth token and user info
        authToken = data.token;
        currentUser = {
            id: data.userId,
            email: email,
            role: data.role
        };
        
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        // Show logged in UI
        showLoggedInUI();
        loadDashboard();
    } catch (error) {
        errorElement.textContent = error.message;
        errorElement.style.display = 'block';
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('register-firstname').value;
    const lastName = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const msisdn = document.getElementById('register-msisdn').value;
    const password = document.getElementById('register-password').value;
    
    const errorElement = document.getElementById('register-error');
    const successElement = document.getElementById('register-success');
    
    try {
        errorElement.style.display = 'none';
        successElement.style.display = 'none';
        
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                phone,
                msisdn,
                password
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        
        // Show success message
        successElement.textContent = 'Registration successful! You can now log in.';
        successElement.style.display = 'block';
        
        // Clear form
        document.getElementById('register-form').reset();
        
        // Switch to login tab
        const loginTab = document.getElementById('login-tab');
        const bootstrap = window.bootstrap;
        const tab = new bootstrap.Tab(loginTab);
        tab.show();
    } catch (error) {
        errorElement.textContent = error.message;
        errorElement.style.display = 'block';
    }
}

function handleLogout() {
    // Clear auth token and user info
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    authToken = null;
    currentUser = null;
    
    // Show login UI
    showLoginUI();
    
    // Redirect to index page if not already there
    if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
        window.location.href = 'index.html';
    }
}

// Password reset functions
function showForgotPasswordForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('reset-password-form').style.display = 'block';
}

async function handlePasswordReset(event) {
    event.preventDefault();
    
    const email = document.getElementById('reset-email').value;
    const errorElement = document.getElementById('reset-error');
    const successElement = document.getElementById('reset-success');
    
    try {
        errorElement.style.display = 'none';
        successElement.style.display = 'none';
        
        // In a real application, this would call an API endpoint
        // For now, we'll simulate a successful password reset
        
        // Show success message
        successElement.textContent = 'Password reset instructions have been sent to your email.';
        successElement.style.display = 'block';
        
        // Clear form
        document.getElementById('reset-password-form').reset();
        
        // After 3 seconds, switch back to login form
        setTimeout(() => {
            document.getElementById('reset-password-form').style.display = 'none';
            document.getElementById('login-form').style.display = 'block';
        }, 3000);
    } catch (error) {
        errorElement.textContent = error.message;
        errorElement.style.display = 'block';
    }
}

// UI functions
function showLoginUI() {
    const authContainer = document.getElementById('auth-container');
    if (authContainer) {
        authContainer.style.display = 'flex';
    }
    
    const dashboardContainer = document.getElementById('dashboard-container');
    if (dashboardContainer) {
        dashboardContainer.style.display = 'none';
    }
    
    // Hide sidebar
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.add('d-none');
        sidebar.classList.remove('d-md-block');
    }
}

function showLoggedInUI() {
    const authContainer = document.getElementById('auth-container');
    if (authContainer) {
        authContainer.style.display = 'none';
    }
    
    // Show sidebar
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.remove('d-none');
        sidebar.classList.add('d-md-block');
    }
    
    // Update user role badge
    const userRoleElement = document.getElementById('user-role');
    if (userRoleElement && currentUser) {
        userRoleElement.textContent = currentUser.role.toUpperCase();
    }
    
    // Show dashboard by default
    const dashboardContainer = document.getElementById('dashboard-container');
    if (dashboardContainer) {
        dashboardContainer.style.display = 'block';
        loadDashboard();
    }
    
    // Check if user is admin
    if (currentUser && currentUser.role !== 'admin') {
        // Hide admin-only elements
        const createAdminBtn = document.getElementById('create-admin-btn');
        if (createAdminBtn) {
            createAdminBtn.style.display = 'none';
        }
    } else if (currentUser) {
        const createAdminBtn = document.getElementById('create-admin-btn');
        if (createAdminBtn) {
            createAdminBtn.style.display = 'block';
        }
    }
}

// Dashboard functions
async function loadDashboard() {
    try {
        // Load dashboard data
        const [usersCount, transactionsCount, pointsSum, recentUsers, recentTransactions] = await Promise.all([
            fetchUsersCount(),
            fetchTransactionsCount(),
            fetchTotalPoints(),
            fetchRecentUsers(),
            fetchRecentTransactions()
        ]);
        
        // Update dashboard UI
        const totalUsersElement = document.getElementById('total-users');
        if (totalUsersElement) {
            totalUsersElement.textContent = usersCount;
        }
        
        const totalTransactionsElement = document.getElementById('total-transactions');
        if (totalTransactionsElement) {
            totalTransactionsElement.textContent = transactionsCount;
        }
        
        const totalPointsElement = document.getElementById('total-points');
        if (totalPointsElement) {
            totalPointsElement.textContent = pointsSum;
        }
        
        // Populate recent users table
        const recentUsersTable = document.getElementById('recent-users-table');
        if (recentUsersTable) {
            recentUsersTable.innerHTML = '';
            
            recentUsers.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.email}</td>
                    <td><span class="badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}">${user.role}</span></td>
                `;
                recentUsersTable.appendChild(row);
            });
        }
        
        // Populate recent transactions table
        const recentTransactionsTable = document.getElementById('recent-transactions-table');
        if (recentTransactionsTable) {
            recentTransactionsTable.innerHTML = '';
            
            recentTransactions.forEach(transaction => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${transaction.msisdn}</td>
                    <td>₦${transaction.rechargeAmount.toFixed(2)}</td>
                    <td>${transaction.points}</td>
                    <td>${new Date(transaction.rechargeDate).toLocaleDateString()}</td>
                `;
                recentTransactionsTable.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function fetchUsersCount() {
    // This would be a real API call in production
    // For now, return a mock value
    return 120;
}

async function fetchTransactionsCount() {
    // This would be a real API call in production
    // For now, return a mock value
    return 1458;
}

async function fetchTotalPoints() {
    // This would be a real API call in production
    // For now, return a mock value
    return 8742;
}

async function fetchRecentUsers() {
    // This would be a real API call in production
    // For now, return mock data
    return [
        { firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'user' },
        { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'admin' },
        { firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', role: 'user' },
        { firstName: 'Alice', lastName: 'Williams', email: 'alice@example.com', role: 'user' },
        { firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com', role: 'user' }
    ];
}

async function fetchRecentTransactions() {
    // This would be a real API call in production
    // For now, return mock data
    return [
        { msisdn: '2347012345678', rechargeAmount: 500, points: 5, rechargeDate: '2025-04-20T10:30:00Z' },
        { msisdn: '2347023456789', rechargeAmount: 1000, points: 10, rechargeDate: '2025-04-21T11:45:00Z' },
        { msisdn: '2347034567890', rechargeAmount: 200, points: 2, rechargeDate: '2025-04-22T09:15:00Z' },
        { msisdn: '2347045678901', rechargeAmount: 750, points: 7, rechargeDate: '2025-04-23T14:20:00Z' },
        { msisdn: '2347056789012', rechargeAmount: 300, points: 3, rechargeDate: '2025-04-24T16:10:00Z' }
    ];
}

// User management functions
async function loadUsers() {
    try {
        // In a real application, this would fetch users from the API
        // For now, we'll use mock data
        const users = [
            { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '2347012345678', msisdn: '2347012345678', role: 'user', optInStatus: true, points: 15 },
            { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '2347023456789', msisdn: '2347023456789', role: 'admin', optInStatus: true, points: 0 },
            { id: '3', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', phone: '2347034567890', msisdn: '2347034567890', role: 'user', optInStatus: false, points: 8 },
            { id: '4', firstName: 'Alice', lastName: 'Williams', email: 'alice@example.com', phone: '2347045678901', msisdn: '2347045678901', role: 'user', optInStatus: true, points: 22 },
            { id: '5', firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com', phone: '2347056789012', msisdn: '2347056789012', role: 'user', optInStatus: true, points: 5 }
        ];
        
        // Populate users table
        const usersTable = document.getElementById('users-table');
        if (usersTable) {
            usersTable.innerHTML = '';
            
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.msisdn}</td>
                    <td><span class="badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}">${user.role}</span></td>
                    <td><span class="badge ${user.optInStatus ? 'bg-success' : 'bg-secondary'}">${user.optInStatus ? 'Opted In' : 'Opted Out'}</span></td>
                    <td>${user.points}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary view-user" data-id="${user.id}">View</button>
                        <button class="btn btn-sm btn-outline-danger ${currentUser.role !== 'admin' ? 'disabled' : ''}" ${currentUser.role !== 'admin' ? 'disabled' : ''} data-id="${user.id}">Delete</button>
                    </td>
                `;
                usersTable.appendChild(row);
            });
            
            // Add event listeners to view buttons
            document.querySelectorAll('.view-user').forEach(button => {
                button.addEventListener('click', () => {
                    const userId = button.getAttribute('data-id');
                    // In a real application, this would navigate to a user details page
                    alert(`View user ${userId}`);
                });
            });
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function showCreateAdminModal() {
    // Show the create admin modal
    const createAdminModal = document.getElementById('createAdminModal');
    if (createAdminModal) {
        const modal = new bootstrap.Modal(createAdminModal);
        modal.show();
    }
}

async function handleCreateAdmin() {
    const firstName = document.getElementById('admin-firstname').value;
    const lastName = document.getElementById('admin-lastname').value;
    const email = document.getElementById('admin-email').value;
    const phone = document.getElementById('admin-phone').value;
    const msisdn = document.getElementById('admin-msisdn').value;
    const password = document.getElementById('admin-password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                phone,
                msisdn,
                password,
                role: 'admin'
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create admin user');
        }
        
        // Close modal
        const createAdminModal = document.getElementById('createAdminModal');
        if (createAdminModal) {
            const modal = bootstrap.Modal.getInstance(createAdminModal);
            modal.hide();
        }
        
        // Reload users
        loadUsers();
        
        // Show success message
        alert('Admin user created successfully');
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}
