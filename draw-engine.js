// Draw Engine JavaScript functionality

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
    
    // MSISDN ending filter toggle
    document.getElementById('filter-msisdn-ending').addEventListener('change', function() {
        const msisdnEndingInputs = document.getElementById('msisdn-ending-inputs');
        msisdnEndingInputs.style.display = this.checked ? 'block' : 'none';
    });
    
    // Minimum points filter toggle
    document.getElementById('filter-min-points').addEventListener('change', function() {
        const minPointsInput = document.getElementById('min-points-input');
        minPointsInput.style.display = this.checked ? 'block' : 'none';
    });
    
    // Draw configuration form
    document.getElementById('draw-config-form').addEventListener('submit', handleRunDraw);
    
    // View winners buttons
    document.querySelectorAll('.btn-outline-primary').forEach(button => {
        if (button.textContent === 'View Winners') {
            button.addEventListener('click', () => showWinnersModal('Daily Draw #0'));
        }
    });
    
    // View winners button in run draw modal
    document.getElementById('view-winners-btn').addEventListener('click', () => {
        // Close run draw modal
        const runDrawModal = bootstrap.Modal.getInstance(document.getElementById('runDrawModal'));
        runDrawModal.hide();
        
        // Show winners modal
        showWinnersModal('New Draw');
    });
    
    // Notify winners button
    document.getElementById('notify-winners-btn').addEventListener('click', handleNotifyWinners);
    
    // Export winners button
    document.getElementById('export-winners-btn').addEventListener('click', handleExportWinners);
}

// Handle logout
function handleLogout() {
    // Clear auth token and user info
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = 'index.html';
}

// Handle running a draw
async function handleRunDraw(event) {
    event.preventDefault();
    
    // Get form values
    const drawName = document.getElementById('draw-name').value;
    const drawDate = document.getElementById('draw-date').value;
    const drawTime = document.getElementById('draw-time').value;
    const drawType = document.getElementById('draw-type').value;
    const numWinners = parseInt(document.getElementById('num-winners').value);
    
    // Get filter values
    const filterDateRange = document.getElementById('filter-date-range').checked;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    const filterMsisdnEnding = document.getElementById('filter-msisdn-ending').checked;
    const msisdnEndings = [];
    if (filterMsisdnEnding) {
        for (let i = 0; i <= 9; i++) {
            if (document.getElementById(`ending-${i}`).checked) {
                msisdnEndings.push(i);
            }
        }
    }
    
    const filterMinPoints = document.getElementById('filter-min-points').checked;
    const minPoints = filterMinPoints ? parseInt(document.getElementById('min-points').value) : 0;
    
    // Validate form
    if (!drawName || !drawDate || !drawTime || !drawType || isNaN(numWinners) || numWinners < 1) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (filterDateRange && (!startDate || !endDate)) {
        alert('Please select start and end dates');
        return;
    }
    
    if (filterMsisdnEnding && msisdnEndings.length === 0) {
        alert('Please select at least one MSISDN ending digit');
        return;
    }
    
    // Show run draw modal
    const runDrawModal = new bootstrap.Modal(document.getElementById('runDrawModal'));
    runDrawModal.show();
    
    // Simulate draw running
    document.getElementById('draw-running').style.display = 'block';
    document.getElementById('draw-complete').style.display = 'none';
    document.getElementById('view-winners-btn').style.display = 'none';
    
    // In a real application, this would make an API call to run the draw
    // For now, we'll simulate it with a timeout
    setTimeout(() => {
        // Show draw complete
        document.getElementById('draw-running').style.display = 'none';
        document.getElementById('draw-complete').style.display = 'block';
        document.getElementById('view-winners-btn').style.display = 'inline-block';
        
        // Set winners count
        document.getElementById('winners-count').textContent = numWinners;
        
        // Add draw to results table
        addDrawToResultsTable(drawName, `${drawDate} ${drawTime}`, numWinners);
    }, 3000);
}

// Add draw to results table
function addDrawToResultsTable(drawName, dateTime, winners) {
    const table = document.getElementById('draw-results-table');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${drawName}</td>
        <td>${dateTime}</td>
        <td>${winners}</td>
        <td><span class="badge bg-success">Completed</span></td>
        <td>
            <button class="btn btn-sm btn-outline-primary">View Winners</button>
            <button class="btn btn-sm btn-outline-secondary">Export</button>
        </td>
    `;
    
    // Add event listener to view winners button
    const viewWinnersBtn = row.querySelector('.btn-outline-primary');
    viewWinnersBtn.addEventListener('click', () => showWinnersModal(drawName));
    
    // Add row to table
    table.insertBefore(row, table.firstChild);
}

// Show winners modal
function showWinnersModal(drawName) {
    // Set modal title
    document.getElementById('drawWinnersModalLabel').textContent = `${drawName} - Winners`;
    
    // Generate mock winners data
    const winners = generateMockWinners(10);
    
    // Populate winners table
    const winnersTable = document.getElementById('winners-table');
    winnersTable.innerHTML = '';
    
    winners.forEach((winner, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${winner.msisdn}</td>
            <td>${winner.name}</td>
            <td>${winner.points}</td>
            <td>${winner.prize}</td>
            <td><span class="badge ${winner.notified ? 'bg-success' : 'bg-warning'}">${winner.notified ? 'Notified' : 'Pending'}</span></td>
        `;
        winnersTable.appendChild(row);
    });
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('drawWinnersModal'));
    modal.show();
}

// Generate mock winners data
function generateMockWinners(count) {
    const winners = [];
    const prizes = ['₦10,000', '₦5,000', '₦2,000', '₦1,000', '₦500'];
    
    for (let i = 0; i < count; i++) {
        winners.push({
            msisdn: `234${Math.floor(7000000000 + Math.random() * 1000000000)}`,
            name: `User ${i + 1}`,
            points: Math.floor(1 + Math.random() * 10),
            prize: prizes[Math.min(i, prizes.length - 1)],
            notified: Math.random() > 0.5
        });
    }
    
    return winners;
}

// Handle notifying winners
function handleNotifyWinners() {
    // In a real application, this would make an API call to send notifications
    // For now, we'll just show an alert
    alert('Notifications sent to winners!');
    
    // Update status badges
    const badges = document.querySelectorAll('#winners-table .badge');
    badges.forEach(badge => {
        badge.className = 'badge bg-success';
        badge.textContent = 'Notified';
    });
}

// Handle exporting winners
function handleExportWinners() {
    // In a real application, this would generate a CSV or Excel file
    // For now, we'll just show an alert
    alert('Winners list exported!');
}
