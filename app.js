// Global variables
const API_BASE_URL = 'https://bridgetunes-mtn-backend.onrender.com/api';
let currentUser = null;
let authToken = null;
let currentPage = 'dashboard';
let transactionsPage = 1;
let transactionsPerPage = 10;

// DOM elements
const authContainer = document.getElementById('auth-container');
const dashboardContainer = document.getElementById('dashboard-container');
const usersContainer = document.getElementById('users-container');
const uploadContainer = document.getElementById('upload-container');
const transactionsContainer = document.getElementById('transactions-container');

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
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // Navigation event listeners
    document.getElementById('dashboard-link').addEventListener('click', () => navigateTo('dashboard'));
    document.getElementById('users-link').addEventListener('click', () => navigateTo('users'));
    document.getElementById('upload-link').addEventListener('click', () => navigateTo('upload'));
    document.getElementById('transactions-link').addEventListener('click', () => navigateTo('transactions'));
    document.getElementById('logout-link').addEventListener('click', handleLogout);
    
    // Admin creation
    document.getElementById('create-admin-btn').addEventListener('click', showCreateAdminModal);
    document.getElementById('submit-admin-btn').addEventListener('click', handleCreateAdmin);
    
    // CSV upload
    document.getElementById('csv-upload-form').addEventListener('submit', handleCSVUpload);
    
    // Transaction search
    document.getElementById('search-btn').addEventListener('click', handleTransactionSearch);
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
}

// UI functions
function showLoginUI() {
    authContainer.style.display = 'flex';
    dashboardContainer.style.display = 'none';
    usersContainer.style.display = 'none';
    uploadContainer.style.display = 'none';
    transactionsContainer.style.display = 'none';
    
    // Hide sidebar
    document.getElementById('sidebar').classList.add('d-none');
    document.getElementById('sidebar').classList.remove('d-md-block');
}

function showLoggedInUI() {
    authContainer.style.display = 'none';
    
    // Show sidebar
    document.getElementById('sidebar').classList.remove('d-none');
    document.getElementById('sidebar').classList.add('d-md-block');
    
    // Update user role badge
    document.getElementById('user-role').textContent = currentUser.role.toUpperCase();
    
    // Show appropriate container based on current page
    navigateTo(currentPage);
    
    // Check if user is admin
    if (currentUser.role !== 'admin') {
        // Hide admin-only elements
        document.getElementById('create-admin-btn').style.display = 'none';
    } else {
        document.getElementById('create-admin-btn').style.display = 'block';
    }
}

function navigateTo(page) {
    // Update current page
    currentPage = page;
    
    // Hide all containers
    dashboardContainer.style.display = 'none';
    usersContainer.style.display = 'none';
    uploadContainer.style.display = 'none';
    transactionsContainer.style.display = 'none';
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show appropriate container and set active nav link
    switch (page) {
        case 'dashboard':
            dashboardContainer.style.display = 'block';
            document.getElementById('dashboard-link').classList.add('active');
            loadDashboard();
            break;
        case 'users':
            usersContainer.style.display = 'block';
            document.getElementById('users-link').classList.add('active');
            loadUsers();
            break;
        case 'upload':
            uploadContainer.style.display = 'block';
            document.getElementById('upload-link').classList.add('active');
            break;
        case 'transactions':
            transactionsContainer.style.display = 'block';
            document.getElementById('transactions-link').classList.add('active');
            loadTransactions();
            break;
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
        document.getElementById('total-users').textContent = usersCount;
        document.getElementById('total-transactions').textContent = transactionsCount;
        document.getElementById('total-points').textContent = pointsSum;
        
        // Populate recent users table
        const recentUsersTable = document.getElementById('recent-users-table');
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
        
        // Populate recent transactions table
        const recentTransactionsTable = document.getElementById('recent-transactions-table');
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
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function showCreateAdminModal() {
    // Show the create admin modal
    const modal = new bootstrap.Modal(document.getElementById('createAdminModal'));
    modal.show();
}

async function handleCreateAdmin() {
    const firstName = document.getElementById('admin-firstname').value;
    const lastName = document.getElementById('admin-lastname').value;
    const email = document.getElementById('admin-email').value;
    const phone = document.getElementById('admin-phone').value;
    const msisdn = document.getElementById('admin-msisdn').value;
    const password = document.getElementById('admin-password').value;
    
    const errorElement = document.getElementById('admin-error');
    
    try {
        errorElement.style.display = 'none';
        
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
                password
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create admin');
        }
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('createAdminModal'));
        modal.hide();
        
        // Reload users
        loadUsers();
        
        // Show success alert
        alert('Admin created successfully');
    } catch (error) {
        errorElement.textContent = error.message;
        errorElement.style.display = 'block';
    }
}

// CSV upload functions
async function handleCSVUpload(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById('csv-file');
    const file = fileInput.files[0];
    
    if (!file) {
        document.getElementById('upload-error').textContent = 'Please select a file';
        document.getElementById('upload-error').style.display = 'block';
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const progressBar = document.getElementById('upload-progress');
    const progressBarInner = progressBar.querySelector('.progress-bar');
    const errorElement = document.getElementById('upload-error');
    const successElement = document.getElementById('upload-success');
    
    try {
        // Reset UI
        errorElement.style.display = 'none';
        successElement.style.display = 'none';
        progressBar.style.display = 'block';
        progressBarInner.style.width = '0%';
        
        // Simulate progress (in a real app, this would use fetch with progress events)
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            progressBarInner.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(progressInterval);
            }
        }, 300);
        
        const response = await fetch(`${API_BASE_URL}/upload/transactions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });
        
        clearInterval(progressInterval);
        progressBarInner.style.width = '100%';
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
        }
        
        // Show success message
        successElement.textContent = `Upload successful! Processed ${data.totalRecords} records, inserted ${data.inserted} records.`;
        successElement.style.display = 'block';
        
        // Clear form
        document.getElementById('csv-upload-form').reset();
        
        // Hide progress bar after a delay
        setTimeout(() => {
            progressBar.style.display = 'none';
        }, 2000);
    } catch (error) {
        // Show error message
        errorElement.textContent = error.message;
        errorElement.style.display = 'block';
        
        // Hide progress bar
        progressBar.style.display = 'none';
    }
}

// Transaction functions
async function loadTransactions(page = 1, msisdnFilter = '') {
    try {
        transactionsPage = page;
        
        // In a real application, this would fetch transactions from the API
        // For now, we'll use mock data
        let transactions = [
            { msisdn: '2347012345678', rechargeAmount: 500, optInStatus: true, rechargeDate: '2025-04-20T10:30:00Z', points: 5 },
            { msisdn: '2347023456789', rechargeAmount: 1000, optInStatus: true, rechargeDate: '2025-04-21T11:45:00Z', points: 10 },
            { msisdn: '2347034567890', rechargeAmount: 200, optInStatus: false, rechargeDate: '2025-04-22T09:15:00Z', points: 2 },
            { msisdn: '2347045678901', rechargeAmount: 750, optInStatus: true, rechargeDate: '2025-04-23T14:20:00Z', points: 7 },
            { msisdn: '2347056789012', rechargeAmount: 300, optInStatus: true, rechargeDate: '2025-04-24T16:10:00Z', points: 3 },
            { msisdn: '2347067890123', rechargeAmount: 100, optInStatus: true, rechargeDate: '2025-04-20T08:05:00Z', points: 1 },
            { msisdn: '2347078901234', rechargeAmount: 1500, optInStatus: true, rechargeDate: '2025-04-21T13:30:00Z', points: 10 },
            { msisdn: '2347089012345', rechargeAmount: 250, optInStatus: false, rechargeDate: '2025-04-22T10:45:00Z', points: 2 },
            { msisdn: '2347090123456', rechargeAmount: 800, optInStatus: true, rechargeDate: '2025-04-23T15:50:00Z', points: 8 },
            { msisdn: '2347001234567', rechargeAmount: 350, optInStatus: true, rechargeDate: '2025-04-24T17:40:00Z', points: 3 },
            { msisdn: '2347012345678', rechargeAmount: 600, optInStatus: true, rechargeDate: '2025-04-20T09:20:00Z', points: 6 },
            { msisdn: '2347023456789', rechargeAmount: 1200, optInStatus: true, rechargeDate: '2025-04-21T12:15:00Z', points: 10 },
            { msisdn: '2347034567890', rechargeAmount: 150, optInStatus: false, rechargeDate: '2025-04-22T08:30:00Z', points: 1 },
            { msisdn: '2347045678901', rechargeAmount: 900, optInStatus: true, rechargeDate: '2025-04-23T16:05:00Z', points: 9 },
            { msisdn: '2347056789012', rechargeAmount: 400, optInStatus: true, rechargeDate: '2025-04-24T18:25:00Z', points: 4 }
        ];
        
        // Apply MSISDN filter if provided
        if (msisdnFilter) {
            transactions = transactions.filter(t => t.msisdn.includes(msisdnFilter));
        }
        
        // Calculate pagination
        const totalTransactions = transactions.length;
        const totalPages = Math.ceil(totalTransactions / transactionsPerPage);
        const startIndex = (page - 1) * transactionsPerPage;
        const endIndex = startIndex + transactionsPerPage;
        const paginatedTransactions = transactions.slice(startIndex, endIndex);
        
        // Populate transactions table
        const transactionsTable = document.getElementById('transactions-table');
        transactionsTable.innerHTML = '';
        
        paginatedTransactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.msisdn}</td>
                <td>₦${transaction.rechargeAmount.toFixed(2)}</td>
                <td><span class="badge ${transaction.optInStatus ? 'bg-success' : 'bg-secondary'}">${transaction.optInStatus ? 'Yes' : 'No'}</span></td>
                <td>${new Date(transaction.rechargeDate).toLocaleDateString()}</td>
                <td>${transaction.points}</td>
            `;
            transactionsTable.appendChild(row);
        });
        
        // Update pagination
        const paginationElement = document.getElementById('transactions-pagination');
        paginationElement.innerHTML = '';
        
        // Previous button
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${page === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#" ${page === 1 ? 'tabindex="-1" aria-disabled="true"' : ''}>Previous</a>`;
        prevLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (page > 1) {
                loadTransactions(page - 1, msisdnFilter);
            }
        });
        paginationElement.appendChild(prevLi);
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${i === page ? 'active' : ''}`;
            pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageLi.addEventListener('click', (e) => {
                e.preventDefault();
                loadTransactions(i, msisdnFilter);
            });
            paginationElement.appendChild(pageLi);
        }
        
        // Next button
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${page === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#" ${page === totalPages ? 'tabindex="-1" aria-disabled="true"' : ''}>Next</a>`;
        nextLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (page < totalPages) {
                loadTransactions(page + 1, msisdnFilter);
            }
        });
        paginationElement.appendChild(nextLi);
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

function handleTransactionSearch() {
    const msisdnFilter = document.getElementById('search-msisdn').value;
    loadTransactions(1, msisdnFilter);
}

// Helper functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Initialize Bootstrap tooltips
document.addEventListener('DOMContentLoaded', function () {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});
