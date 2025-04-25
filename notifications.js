// Notifications JavaScript functionality

// Global variables
const API_BASE_URL = 'https://bridgetunes-mtn-backend.onrender.com/api';
let authToken = null;
let currentUser = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        // User is logged in
        authToken = token;
        currentUser = JSON.parse(user);
        setupEventListeners();
    } else {
        // User is not logged in, redirect to login page
        window.location.href = 'index.html';
    }
});

// Set up event listeners
function setupEventListeners() {
    // Logout
    document.getElementById('logout-link').addEventListener('click', handleLogout);
    
    // Create notification button
    document.getElementById('create-notification-btn').addEventListener('click', showCreateNotificationModal);
    
    // Custom filter toggle
    document.querySelector('input[value="custom"]').addEventListener('change', function() {
        document.getElementById('custom-filter-options').style.display = this.checked ? 'block' : 'none';
    });
    
    // Schedule toggle
    document.querySelector('input[value="later"]').addEventListener('change', function() {
        document.getElementById('schedule-options').style.display = this.checked ? 'block' : 'none';
    });
    
    document.querySelector('input[value="now"]').addEventListener('change', function() {
        document.getElementById('schedule-options').style.display = 'none';
    });
    
    // Save notification button
    document.getElementById('save-notification-btn').addEventListener('click', handleSaveNotification);
    
    // View details buttons
    document.querySelectorAll('.btn-outline-primary').forEach(button => {
        if (button.textContent === 'View Details') {
            button.addEventListener('click', () => showNotificationDetailsModal('Welcome Message Batch #1'));
        }
    });
    
    // Export details button
    document.getElementById('export-details-btn').addEventListener('click', handleExportDetails);
    
    // Template use buttons
    document.querySelectorAll('.btn-outline-success').forEach(button => {
        if (button.textContent === 'Use') {
            button.addEventListener('click', (e) => {
                const templateName = e.target.closest('tr').querySelector('td:first-child').textContent;
                useTemplate(templateName);
            });
        }
    });
}

// Handle logout
function handleLogout() {
    // Clear auth token and user info
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = 'index.html';
}

// Show create notification modal
function showCreateNotificationModal() {
    // Reset form
    document.getElementById('notification-form').reset();
    document.getElementById('custom-filter-options').style.display = 'none';
    document.getElementById('schedule-options').style.display = 'none';
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('createNotificationModal'));
    modal.show();
}

// Handle save notification
function handleSaveNotification() {
    // Get form values
    const name = document.getElementById('notification-name').value;
    const type = document.getElementById('notification-type').value;
    const subject = document.getElementById('notification-subject').value;
    const content = document.getElementById('notification-content').value;
    
    // Get recipients
    const recipientsType = document.querySelector('input[name="recipients"]:checked').value;
    
    // Get schedule
    const scheduleType = document.querySelector('input[name="schedule"]:checked').value;
    
    // Validate form
    if (!name || !type || !subject || !content) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (scheduleType === 'later') {
        const scheduleDate = document.getElementById('schedule-date').value;
        const scheduleTime = document.getElementById('schedule-time').value;
        
        if (!scheduleDate || !scheduleTime) {
            alert('Please select schedule date and time');
            return;
        }
    }
    
    // In a real application, this would make an API call to save the notification
    // For now, we'll just show a success message and update the UI
    
    if (scheduleType === 'later') {
        // Add to scheduled notifications
        addToScheduledNotifications(name, type, recipientsType);
    } else {
        // Add to notification history
        addToNotificationHistory(name, type, recipientsType);
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('createNotificationModal'));
    modal.hide();
    
    // Show success message
    alert('Notification saved successfully!');
}

// Add to scheduled notifications
function addToScheduledNotifications(name, type, recipientsType) {
    const table = document.getElementById('scheduled-table');
    const row = document.createElement('tr');
    
    // Get recipients text
    let recipientsText = 'All Users';
    if (recipientsType === 'active') {
        recipientsText = 'Active Users';
    } else if (recipientsType === 'inactive') {
        recipientsText = 'Inactive Users';
    } else if (recipientsType === 'custom') {
        recipientsText = 'Custom Filter';
    }
    
    // Get schedule date
    const scheduleDate = document.getElementById('schedule-date').value;
    const scheduleTime = document.getElementById('schedule-time').value;
    const scheduleDateObj = new Date(`${scheduleDate}T${scheduleTime}`);
    const formattedDate = `${scheduleDateObj.toLocaleDateString()} ${scheduleDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    row.innerHTML = `
        <td>${name}</td>
        <td><span class="badge bg-info">${type.toUpperCase()}</span></td>
        <td>${recipientsText}</td>
        <td>${formattedDate}</td>
        <td><span class="badge bg-warning">Scheduled</span></td>
        <td>
            <button class="btn btn-sm btn-outline-primary">Edit</button>
            <button class="btn btn-sm btn-outline-danger">Cancel</button>
        </td>
    `;
    
    table.insertBefore(row, table.firstChild);
}

// Add to notification history
function addToNotificationHistory(name, type, recipientsType) {
    const table = document.getElementById('history-table');
    const row = document.createElement('tr');
    
    // Get recipients count based on type
    let recipientsCount = 250; // Default for all users
    if (recipientsType === 'active') {
        recipientsCount = 180;
    } else if (recipientsType === 'inactive') {
        recipientsCount = 70;
    } else if (recipientsType === 'custom') {
        recipientsCount = 50;
    }
    
    // Get current date and time
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    row.innerHTML = `
        <td>${name}</td>
        <td><span class="badge bg-info">${type.toUpperCase()}</span></td>
        <td>${recipientsCount}</td>
        <td>${formattedDate}</td>
        <td><span class="badge bg-success">Completed</span></td>
        <td>
            <button class="btn btn-sm btn-outline-primary">View Details</button>
        </td>
    `;
    
    // Add event listener to view details button
    const viewDetailsBtn = row.querySelector('.btn-outline-primary');
    viewDetailsBtn.addEventListener('click', () => showNotificationDetailsModal(name));
    
    table.insertBefore(row, table.firstChild);
}

// Show notification details modal
function showNotificationDetailsModal(notificationName) {
    // Set modal title
    document.getElementById('notificationDetailsModalLabel').textContent = `${notificationName} - Details`;
    
    // Set details
    document.getElementById('detail-name').textContent = notificationName;
    document.getElementById('detail-type').textContent = 'SMS';
    document.getElementById('detail-date').textContent = 'Apr 24, 2025 10:30 AM';
    document.getElementById('detail-status').innerHTML = '<span class="badge bg-success">Completed</span>';
    document.getElementById('detail-content').textContent = 'Welcome to MTN MyNumba Don Win! Your number {msisdn} has been registered. Top up your line to earn points and win amazing prizes!';
    
    // Set statistics
    document.getElementById('detail-total').textContent = '250';
    document.getElementById('detail-delivered').textContent = '245';
    document.getElementById('detail-pending').textContent = '0';
    document.getElementById('detail-failed').textContent = '5';
    
    // Populate recipients table
    const recipientsTable = document.getElementById('recipients-table');
    recipientsTable.innerHTML = '';
    
    // Generate mock recipients
    const recipients = generateMockRecipients(10);
    
    recipients.forEach(recipient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${recipient.msisdn}</td>
            <td><span class="badge ${recipient.status === 'Delivered' ? 'bg-success' : 'bg-danger'}">${recipient.status}</span></td>
            <td>${recipient.time}</td>
        `;
        recipientsTable.appendChild(row);
    });
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('notificationDetailsModal'));
    modal.show();
}

// Generate mock recipients
function generateMockRecipients(count) {
    const recipients = [];
    const statuses = ['Delivered', 'Failed'];
    
    for (let i = 0; i < count; i++) {
        recipients.push({
            msisdn: `234${Math.floor(7000000000 + Math.random() * 1000000000)}`,
            status: Math.random() > 0.2 ? 'Delivered' : 'Failed',
            time: 'Apr 24, 2025 10:30 AM'
        });
    }
    
    return recipients;
}

// Handle export details
function handleExportDetails() {
    // In a real application, this would generate a CSV or Excel file
    // For now, we'll just show an alert
    alert('Notification details exported!');
}

// Use template
function useTemplate(templateName) {
    // Get template content based on name
    let subject = '';
    let content = '';
    
    switch (templateName) {
        case 'Welcome Message':
            subject = 'Welcome to MTN MyNumba Don Win!';
            content = 'Welcome to MTN MyNumba Don Win! Your number {msisdn} has been registered. Top up your line to earn points and win amazing prizes!';
            break;
        case 'Draw Winner':
            subject = 'Congratulations! You\'ve won in our draw!';
            content = 'Congratulations {firstName}! Your number {msisdn} has won {prize} in our recent draw. Please contact our customer service to claim your prize.';
            break;
        case 'Top-up Confirmation':
            subject = 'Your top-up has been received!';
            content = 'Thank you for your top-up of {amount}. You have earned {points} points. Keep topping up to increase your chances of winning!';
            break;
        case 'Draw Announcement':
            subject = 'Don\'t miss our upcoming draw!';
            content = 'Dear {firstName}, our next draw is coming up soon! Make sure to top up your line to increase your chances of winning amazing prizes.';
            break;
    }
    
    // Show create notification modal
    showCreateNotificationModal();
    
    // Fill in template details
    document.getElementById('notification-name').value = `${templateName} - ${new Date().toLocaleDateString()}`;
    document.getElementById('notification-type').value = 'sms';
    document.getElementById('notification-subject').value = subject;
    document.getElementById('notification-content').value = content;
}
