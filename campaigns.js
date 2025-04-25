// Campaigns JavaScript functionality

// Global variables
const API_BASE_URL = 'https://bridgetunes-mtn-backend.onrender.com/api';
let authToken = null;
let currentUser = null;
let performanceChart = null;

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
    
    // Create campaign button
    document.getElementById('create-campaign-btn').addEventListener('click', showCreateCampaignModal);
    
    // Campaign type change
    document.getElementById('campaign-type').addEventListener('change', handleCampaignTypeChange);
    
    // Daily limit checkbox
    document.getElementById('daily-limit-check').addEventListener('change', function() {
        document.getElementById('daily-limit-input').style.display = this.checked ? 'block' : 'none';
    });
    
    // Entry criteria change
    document.getElementById('entry-criteria').addEventListener('change', function() {
        document.getElementById('criteria-value-input').style.display = 
            (this.value === 'min' || this.value === 'points') ? 'block' : 'none';
    });
    
    // Require top-up checkbox
    document.getElementById('require-topup-check').addEventListener('change', function() {
        document.getElementById('require-topup-input').style.display = this.checked ? 'block' : 'none';
    });
    
    // Reminder notification checkbox
    document.getElementById('reminder-notification-check').addEventListener('change', function() {
        document.getElementById('reminder-frequency-input').style.display = this.checked ? 'block' : 'none';
    });
    
    // Custom audience radio
    document.getElementById('custom-audience-radio').addEventListener('change', function() {
        document.getElementById('custom-audience-options').style.display = this.checked ? 'block' : 'none';
    });
    
    document.getElementById('all-users-radio').addEventListener('change', function() {
        document.getElementById('custom-audience-options').style.display = 'none';
    });
    
    document.getElementById('active-users-radio').addEventListener('change', function() {
        document.getElementById('custom-audience-options').style.display = 'none';
    });
    
    // Save campaign button
    document.getElementById('save-campaign-btn').addEventListener('click', handleSaveCampaign);
    
    // View campaign results buttons
    document.querySelectorAll('.btn-outline-primary').forEach(button => {
        if (button.textContent === 'View Results') {
            button.addEventListener('click', (e) => {
                const campaignName = e.target.closest('tr').querySelector('td:first-child').textContent;
                showCampaignResultsModal(campaignName);
            });
        }
    });
    
    // Export results button
    document.getElementById('export-results-btn').addEventListener('click', handleExportResults);
}

// Handle logout
function handleLogout() {
    // Clear auth token and user info
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = 'index.html';
}

// Show create campaign modal
function showCreateCampaignModal() {
    // Reset form
    document.getElementById('campaign-form').reset();
    
    // Hide all campaign rule sections
    document.getElementById('bonus-rules').style.display = 'none';
    document.getElementById('special-rules').style.display = 'none';
    document.getElementById('referral-rules').style.display = 'none';
    document.getElementById('custom-rules').style.display = 'none';
    
    // Hide other conditional sections
    document.getElementById('daily-limit-input').style.display = 'none';
    document.getElementById('criteria-value-input').style.display = 'none';
    document.getElementById('reminder-frequency-input').style.display = 'none';
    document.getElementById('custom-audience-options').style.display = 'none';
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('createCampaignModal'));
    modal.show();
}

// Handle campaign type change
function handleCampaignTypeChange() {
    const campaignType = document.getElementById('campaign-type').value;
    
    // Hide all campaign rule sections
    document.getElementById('bonus-rules').style.display = 'none';
    document.getElementById('special-rules').style.display = 'none';
    document.getElementById('referral-rules').style.display = 'none';
    document.getElementById('custom-rules').style.display = 'none';
    
    // Show selected campaign rule section
    if (campaignType === 'bonus') {
        document.getElementById('bonus-rules').style.display = 'block';
    } else if (campaignType === 'special') {
        document.getElementById('special-rules').style.display = 'block';
    } else if (campaignType === 'referral') {
        document.getElementById('referral-rules').style.display = 'block';
    } else if (campaignType === 'custom') {
        document.getElementById('custom-rules').style.display = 'block';
    }
}

// Handle save campaign
function handleSaveCampaign() {
    // Get form values
    const name = document.getElementById('campaign-name').value;
    const type = document.getElementById('campaign-type').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const description = document.getElementById('campaign-description').value;
    
    // Validate form
    if (!name || !type || !startDate || !endDate || !description) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
        alert('End date must be after start date');
        return;
    }
    
    // Get current date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // In a real application, this would make an API call to save the campaign
    // For now, we'll just show a success message and update the UI
    
    if (start <= today) {
        // Add to active campaigns
        addToActiveCampaigns(name, type, startDate, endDate);
    } else {
        // Add to upcoming campaigns
        addToUpcomingCampaigns(name, type, startDate, endDate);
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('createCampaignModal'));
    modal.hide();
    
    // Show success message
    alert('Campaign saved successfully!');
}

// Add to active campaigns
function addToActiveCampaigns(name, type, startDate, endDate) {
    const table = document.getElementById('active-campaigns-table');
    const row = document.createElement('tr');
    
    // Format type display name
    let typeDisplayName = 'Custom Campaign';
    if (type === 'bonus') {
        typeDisplayName = 'Bonus Points';
    } else if (type === 'special') {
        typeDisplayName = 'Special Draw';
    } else if (type === 'referral') {
        typeDisplayName = 'Referral Program';
    }
    
    // Format dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const formattedStartDate = startDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedEndDate = endDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    row.innerHTML = `
        <td>${name}</td>
        <td>${typeDisplayName}</td>
        <td>${formattedStartDate}</td>
        <td>${formattedEndDate}</td>
        <td><span class="badge bg-success">Active</span></td>
        <td>0</td>
        <td>
            <button class="btn btn-sm btn-outline-primary">View</button>
            <button class="btn btn-sm btn-outline-warning">Pause</button>
            <button class="btn btn-sm btn-outline-danger">End</button>
        </td>
    `;
    
    table.insertBefore(row, table.firstChild);
}

// Add to upcoming campaigns
function addToUpcomingCampaigns(name, type, startDate, endDate) {
    const table = document.getElementById('upcoming-campaigns-table');
    const row = document.createElement('tr');
    
    // Format type display name
    let typeDisplayName = 'Custom Campaign';
    if (type === 'bonus') {
        typeDisplayName = 'Bonus Points';
    } else if (type === 'special') {
        typeDisplayName = 'Special Draw';
    } else if (type === 'referral') {
        typeDisplayName = 'Referral Program';
    }
    
    // Format dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const formattedStartDate = startDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedEndDate = endDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    row.innerHTML = `
        <td>${name}</td>
        <td>${typeDisplayName}</td>
        <td>${formattedStartDate}</td>
        <td>${formattedEndDate}</td>
        <td><span class="badge bg-warning">Scheduled</span></td>
        <td>
            <button class="btn btn-sm btn-outline-primary">Edit</button>
            <button class="btn btn-sm btn-outline-danger">Cancel</button>
        </td>
    `;
    
    table.insertBefore(row, table.firstChild);
}

// Show campaign results modal
function showCampaignResultsModal(campaignName) {
    // Set modal title
    document.getElementById('campaignResultsModalLabel').textContent = `${campaignName} - Results`;
    
    // Set campaign details
    document.getElementById('result-campaign-name').textContent = campaignName;
    
    // Set campaign type based on name (in a real app, this would come from the API)
    let campaignType = 'Bonus Points';
    if (campaignName === 'Valentine\'s Special') {
        campaignType = 'Special Draw';
    }
    document.getElementById('result-campaign-type').textContent = campaignType;
    
    // Set campaign duration
    let duration = 'Mar 1, 2025 - Mar 31, 2025';
    if (campaignName === 'Valentine\'s Special') {
        duration = 'Feb 10, 2025 - Feb 14, 2025';
    } else if (campaignName === 'New Year Kickoff') {
        duration = 'Jan 1, 2025 - Jan 15, 2025';
    }
    document.getElementById('result-campaign-duration').textContent = duration;
    
    // Set campaign status
    document.getElementById('result-campaign-status').innerHTML = '<span class="badge bg-secondary">Completed</span>';
    
    // Set campaign statistics
    let participants = 412;
    let transactions = 856;
    let totalAmount = '₦245,780';
    let totalPoints = 4856;
    
    if (campaignName === 'Valentine\'s Special') {
        participants = 287;
        transactions = 512;
        totalAmount = '₦178,450';
        totalPoints = 3245;
    } else if (campaignName === 'New Year Kickoff') {
        participants = 356;
        transactions = 723;
        totalAmount = '₦210,320';
        totalPoints = 4120;
    }
    
    document.getElementById('result-participants').textContent = participants;
    document.getElementById('result-transactions').textContent = transactions;
    document.getElementById('result-total-amount').textContent = totalAmount;
    document.getElementById('result-total-points').textContent = totalPoints;
    
    // Populate top participants table
    const topParticipantsTable = document.getElementById('top-participants-table');
    topParticipantsTable.innerHTML = '';
    
    // Generate mock top participants
    const topParticipants = generateMockTopParticipants(5);
    
    topParticipants.forEach(participant => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${participant.msisdn}</td>
            <td>${participant.transactions}</td>
            <td>₦${participant.amount}</td>
            <td>${participant.points}</td>
        `;
        topParticipantsTable.appendChild(row);
    });
    
    // Create performance chart
    createPerformanceChart();
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('campaignResultsModal'));
    modal.show();
}

// Generate mock top participants
function generateMockTopParticipants(count) {
    const participants = [];
    
    for (let i = 0; i < count; i++) {
        participants.push({
            msisdn: `234${Math.floor(7000000000 + Math.random() * 1000000000)}`,
            transactions: Math.floor(5 + Math.random() * 20),
            amount: Math.floor(5000 + Math.random() * 15000),
            points: Math.floor(50 + Math.random() * 200)
        });
    }
    
    // Sort by points (descending)
    participants.sort((a, b) => b.points - a.points);
    
    return participants;
}

// Create performance chart
function createPerformanceChart() {
    // Destroy existing chart if it exists
    if (performanceChart) {
        performanceChart.destroy();
    }
    
    // Get chart canvas
    const ctx = document.getElementById('performance-chart').getContext('2d');
    
    // Generate mock data
    const labels = [];
    const transactionsData = [];
    const pointsData = [];
    
    // Generate 30 days of data
    for (let i = 1; i <= 30; i++) {
        labels.push(`Mar ${i}`);
        transactionsData.push(Math.floor(10 + Math.random() * 40));
        pointsData.push(Math.floor(20 + Math.random() * 200));
    }
    
    // Create chart
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Transactions',
                    data: transactionsData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'Points',
                    data: pointsData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Transactions'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Points'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Handle export results
function handleExportResults() {
    // In a real application, this would generate a CSV or Excel file
    // For now, we'll just show an alert
    alert('Campaign results exported!');
}
