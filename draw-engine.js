// Draw Engine JavaScript functionality

// Global variables
const API_BASE_URL = 'https://bridgetunes-mtn-backend.onrender.com/api';
let authToken = null;
let currentUser = null;
let jackpotRolloverAmount = 0; // Track jackpot rollover amount

// Prize structures
const WEEKDAY_PRIZES = [
    { name: 'Jackpot (1st Prize)', amount: '₦1,000,000', requiresOptIn: true },
    { name: '2nd Prize', amount: '₦350,000', requiresOptIn: true },
    { name: '3rd Prize', amount: '₦150,000', requiresOptIn: true },
    { name: 'Concession Prize #1', amount: '₦75,000', requiresOptIn: true },
    { name: 'Concession Prize #2', amount: '₦75,000', requiresOptIn: true },
    { name: 'Concession Prize #3', amount: '₦75,000', requiresOptIn: true },
    { name: 'Concession Prize #4', amount: '₦75,000', requiresOptIn: true },
    { name: 'Concession Prize #5', amount: '₦75,000', requiresOptIn: true },
    { name: 'Concession Prize #6', amount: '₦75,000', requiresOptIn: true },
    { name: 'Concession Prize #7', amount: '₦75,000', requiresOptIn: true }
];

const SATURDAY_PRIZES = [
    { name: 'Jackpot (1st Prize)', amount: '₦3,000,000', requiresOptIn: true },
    { name: '2nd Prize', amount: '₦1,000,000', requiresOptIn: true },
    { name: '3rd Prize', amount: '₦500,000', requiresOptIn: true },
    { name: 'Concession Prize #1', amount: '₦100,000', requiresOptIn: true },
    { name: 'Concession Prize #2', amount: '₦100,000', requiresOptIn: true },
    { name: 'Concession Prize #3', amount: '₦100,000', requiresOptIn: true },
    { name: 'Concession Prize #4', amount: '₦100,000', requiresOptIn: true },
    { name: 'Concession Prize #5', amount: '₦100,000', requiresOptIn: true },
    { name: 'Concession Prize #6', amount: '₦100,000', requiresOptIn: true },
    { name: 'Concession Prize #7', amount: '₦100,000', requiresOptIn: true }
];

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
        
        // Initialize rollover amount from localStorage or API
        const savedRollover = localStorage.getItem('jackpotRolloverAmount');
        if (savedRollover) {
            jackpotRolloverAmount = parseInt(savedRollover);
        } else {
            // In a real implementation, this would fetch from API
            jackpotRolloverAmount = 0;
        }
        
        // Update jackpot display
        updateJackpotDisplay();
    } else {
        // User is not logged in, redirect to login page
        window.location.href = 'index.html';
    }
});

// Update jackpot display based on day and rollover amount
function updateJackpotDisplay() {
    const jackpotAmountElement = document.getElementById('jackpot-amount');
    if (jackpotAmountElement) {
        const today = new Date();
        const isSaturday = today.getDay() === 6;
        
        let baseJackpot = isSaturday ? 3000000 : 1000000;
        let totalJackpot = baseJackpot + jackpotRolloverAmount;
        
        // Format as currency
        const formattedJackpot = new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(totalJackpot);
        
        jackpotAmountElement.textContent = formattedJackpot;
    }
}

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
    
    // Draw type change event
    document.getElementById('draw-type').addEventListener('change', function() {
        updatePrizeStructureDisplay();
    });
    
    // Draw date change event
    document.getElementById('draw-date').addEventListener('change', function() {
        updatePrizeStructureDisplay();
    });
    
    // Initialize prize structure display
    updatePrizeStructureDisplay();
}

// Update prize structure display based on draw type and date
function updatePrizeStructureDisplay() {
    const drawType = document.getElementById('draw-type').value;
    const drawDate = document.getElementById('draw-date').value;
    
    if (!drawDate || !drawType) return;
    
    const date = new Date(drawDate);
    const isSaturday = date.getDay() === 6;
    
    // Get prize structure based on day
    const prizeStructure = isSaturday ? SATURDAY_PRIZES : WEEKDAY_PRIZES;
    
    // Update prize structure display
    const prizeStructureElement = document.getElementById('prize-structure-display');
    if (prizeStructureElement) {
        let html = '<h5>Prize Structure</h5><ul class="list-group">';
        
        // Calculate jackpot amount with rollovers
        let jackpotAmount = isSaturday ? 3000000 : 1000000;
        jackpotAmount += jackpotRolloverAmount;
        
        // Format jackpot amount
        const formattedJackpot = new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(jackpotAmount);
        
        // Add jackpot with rollover if applicable
        html += `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <span>Jackpot (1st Prize)</span>
                    <span>${formattedJackpot}</span>
                </li>`;
        
        // Add other prizes
        for (let i = 1; i < prizeStructure.length; i++) {
            html += `<li class="list-group-item d-flex justify-content-between align-items-center">
                        <span>${prizeStructure[i].name}</span>
                        <span>${prizeStructure[i].amount}</span>
                    </li>`;
        }
        
        html += '</ul>';
        
        // Add note about opt-in requirement
        html += '<div class="mt-2 small text-muted">Note: Jackpot winner must be opted-in to be valid. All other prizes require opt-in status.</div>';
        
        // Add rollover information if applicable
        if (jackpotRolloverAmount > 0) {
            html += `<div class="mt-2 alert alert-info">
                        This jackpot includes ₦${(jackpotRolloverAmount).toLocaleString()} in rollovers from previous draws.
                    </div>`;
        }
        
        prizeStructureElement.innerHTML = html;
    }
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
        
        // Generate winners with proper prize structure
        const date = new Date(drawDate);
        const isSaturday = date.getDay() === 6;
        generateWinners(numWinners, isSaturday);
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
    
    // Get date from draw name to determine if it's a Saturday draw
    const isSaturday = drawName.toLowerCase().includes('saturday') || 
                       (drawName.includes('Weekly') && new Date().getDay() === 6);
    
    // Generate winners with proper prize structure
    const winners = generateWinners(10, isSaturday);
    
    // Populate winners table
    const winnersTable = document.getElementById('winners-table');
    winnersTable.innerHTML = '';
    
    winners.forEach((winner, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${winner.msisdn}</td>
            <td>${winner.name}</td>
            <td>${winner.optedIn ? '<span class="badge bg-success">Yes</span>' : '<span class="badge bg-danger">No</span>'}</td>
            <td>${winner.prize}</td>
            <td>${winner.prizeAmount}</td>
            <td><span class="badge ${winner.notified ? 'bg-success' : 'bg-warning'}">${winner.notified ? 'Notified' : 'Pending'}</span></td>
        `;
        winnersTable.appendChild(row);
    });
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('drawWinnersModal'));
    modal.show();
}

// Generate winners with proper prize structure
function generateWinners(count, isSaturday) {
    const winners = [];
    const prizeStructure = isSaturday ? SATURDAY_PRIZES : WEEKDAY_PRIZES;
    
    // Calculate jackpot amount with rollovers
    let jackpotAmount = isSaturday ? 3000000 : 1000000;
    jackpotAmount += jackpotRolloverAmount;
    
    // Format jackpot amount
    const formattedJackpot = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(jackpotAmount);
    
    // Generate winners
    for (let i = 0; i < count && i < prizeStructure.length; i++) {
        // For jackpot winner, randomly determine if they're opted in
        const isJackpot = i === 0;
        const optedIn = isJackpot ? Math.random() > 0.3 : true; // 70% chance of jackpot winner being opted in, all others must be opted in
        
        // Determine prize amount
        let prizeAmount = isJackpot ? formattedJackpot : prizeStructure[i].amount;
        
        // Create winner object
        winners.push({
            msisdn: `234${Math.floor(7000000000 + Math.random() * 1000000000)}`,
            name: `User ${i + 1}`,
            optedIn: optedIn,
            prize: prizeStructure[i].name,
            prizeAmount: prizeAmount,
            notified: Math.random() > 0.5,
            valid: optedIn || !isJackpot // Valid if opted in or not a jackpot winner
        });
    }
    
    // Check if jackpot winner is valid
    const jackpotWinner = winners[0];
    if (!jackpotWinner.optedIn) {
        // Jackpot winner is not opted in, mark as invalid and trigger rollover
        jackpotWinner.status = 'Invalid - Not Opted In';
        
        // Update rollover amount
        const rolloverValue = isSaturday ? jackpotAmount : 1000000;
        jackpotRolloverAmount += rolloverValue;
        
        // Save to localStorage (in a real app, this would be saved to the server)
        localStorage.setItem('jackpotRolloverAmount', jackpotRolloverAmount.toString());
        
        // Add rollover note to winner
        jackpotWinner.notes = `Jackpot rolled over (₦${rolloverValue.toLocaleString()})`;
    } else {
        // Valid jackpot winner, reset rollover
        jackpotWinner.status = 'Valid';
        jackpotRolloverAmount = 0;
        localStorage.setItem('jackpotRolloverAmount', '0');
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
        if (badge.textContent === 'Pending') {
            badge.className = 'badge bg-success';
            badge.textContent = 'Notified';
        }
    });
}

// Handle exporting winners
function handleExportWinners() {
    // In a real application, this would generate a CSV or Excel file
    // For now, we'll just show an alert
    alert('Winners list exported!');
}
