// Analytics JavaScript functionality

// Global variables
const API_BASE_URL = 'https://bridgetunes-mtn-backend.onrender.com/api';
let authToken = null;
let currentUser = null;
let transactionsChart = null;
let topupDistributionChart = null;
let userGrowthChart = null;
let userActivityChart = null;
let demographicsChart = null;
let drawTopupChart = null;

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
        initializeCharts();
    } else {
        // User is not logged in, redirect to login page
        window.location.href = 'index.html';
    }
});

// Set up event listeners
function setupEventListeners() {
    // Logout
    document.getElementById('logout-link').addEventListener('click', handleLogout);
    
    // Time period buttons
    document.getElementById('daily-btn').addEventListener('click', () => updateTimePeriod('daily'));
    document.getElementById('weekly-btn').addEventListener('click', () => updateTimePeriod('weekly'));
    document.getElementById('monthly-btn').addEventListener('click', () => updateTimePeriod('monthly'));
    document.getElementById('yearly-btn').addEventListener('click', () => updateTimePeriod('yearly'));
    
    // Date range button
    document.getElementById('date-range-btn').addEventListener('click', showDateRangePicker);
    
    // Generate report button
    document.getElementById('generate-report-btn').addEventListener('click', generateReport);
    
    // Save report button
    document.getElementById('save-report-btn').addEventListener('click', saveReport);
    
    // Draw details buttons
    document.querySelectorAll('.btn-outline-primary').forEach(button => {
        if (button.textContent === 'Details') {
            button.addEventListener('click', (e) => {
                const drawDate = e.target.closest('tr').querySelector('td:first-child').textContent;
                const drawType = e.target.closest('tr').querySelector('td:nth-child(2)').textContent;
                showDrawDetailsModal(drawDate, drawType);
            });
        }
    });
    
    // Export draw details button
    document.getElementById('export-draw-details-btn').addEventListener('click', exportDrawDetails);
    
    // Custom date range in report form
    document.getElementById('date-range').addEventListener('change', function() {
        if (this.value === 'custom') {
            // In a real application, this would show a date range picker
            alert('Custom date range picker would appear here');
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

// Initialize charts
function initializeCharts() {
    createTransactionsChart();
    createTopupDistributionChart();
    createUserGrowthChart();
    createUserActivityChart();
}

// Create transactions chart
function createTransactionsChart() {
    const ctx = document.getElementById('transactions-chart').getContext('2d');
    
    // Generate mock data
    const labels = [];
    const transactionsData = [];
    const revenueData = [];
    
    // Generate 12 months of data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 12; i++) {
        labels.push(months[i]);
        transactionsData.push(Math.floor(2000 + Math.random() * 2000));
        revenueData.push(Math.floor(500000 + Math.random() * 500000));
    }
    
    transactionsChart = new Chart(ctx, {
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
                    label: 'Revenue (₦)',
                    data: revenueData,
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
                        text: 'Revenue (₦)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Create top-up distribution chart
function createTopupDistributionChart() {
    const ctx = document.getElementById('topup-distribution-chart').getContext('2d');
    
    topupDistributionChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['₦100-199', '₦200-299', '₦300-399', '₦400-499', '₦500-599', '₦600+'],
            datasets: [{
                data: [25, 20, 15, 15, 10, 15],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Create user growth chart
function createUserGrowthChart() {
    const ctx = document.getElementById('user-growth-chart').getContext('2d');
    
    // Generate mock data
    const labels = [];
    const newUsersData = [];
    const totalUsersData = [];
    
    // Generate 12 months of data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let totalUsers = 500;
    
    for (let i = 0; i < 12; i++) {
        labels.push(months[i]);
        const newUsers = Math.floor(50 + Math.random() * 100);
        newUsersData.push(newUsers);
        totalUsers += newUsers;
        totalUsersData.push(totalUsers);
    }
    
    userGrowthChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'New Users',
                    data: newUsersData,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Total Users',
                    data: totalUsersData,
                    type: 'line',
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
                        text: 'New Users'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Total Users'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Create user activity chart
function createUserActivityChart() {
    const ctx = document.getElementById('user-activity-chart').getContext('2d');
    
    userActivityChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Active (Last 7 Days)', 'Active (Last 30 Days)', 'Inactive (30+ Days)', 'Dormant (90+ Days)'],
            datasets: [{
                data: [35, 25, 20, 20],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Update time period
function updateTimePeriod(period) {
    // Remove active class from all buttons
    document.getElementById('daily-btn').classList.remove('active');
    document.getElementById('weekly-btn').classList.remove('active');
    document.getElementById('monthly-btn').classList.remove('active');
    document.getElementById('yearly-btn').classList.remove('active');
    
    // Add active class to selected button
    document.getElementById(`${period}-btn`).classList.add('active');
    
    // Update date range button text
    let dateRangeText = 'This Month';
    if (period === 'daily') {
        dateRangeText = 'Today';
    } else if (period === 'weekly') {
        dateRangeText = 'This Week';
    } else if (period === 'yearly') {
        dateRangeText = 'This Year';
    }
    document.getElementById('date-range-btn').textContent = dateRangeText;
    
    // Update charts
    updateCharts(period);
    
    // Update key metrics
    updateKeyMetrics(period);
}

// Show date range picker
function showDateRangePicker() {
    // In a real application, this would show a date range picker
    alert('Date range picker would appear here');
}

// Update charts
function updateCharts(period) {
    // In a real application, this would fetch new data from the API
    // For now, we'll just update the charts with random data
    
    // Update transactions chart
    let labels = [];
    const transactionsData = [];
    const revenueData = [];
    
    if (period === 'daily') {
        // 24 hours
        for (let i = 0; i < 24; i++) {
            labels.push(`${i}:00`);
            transactionsData.push(Math.floor(50 + Math.random() * 100));
            revenueData.push(Math.floor(10000 + Math.random() * 20000));
        }
    } else if (period === 'weekly') {
        // 7 days
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        labels = days;
        for (let i = 0; i < 7; i++) {
            transactionsData.push(Math.floor(200 + Math.random() * 300));
            revenueData.push(Math.floor(50000 + Math.random() * 70000));
        }
    } else if (period === 'monthly') {
        // 30 days
        for (let i = 1; i <= 30; i++) {
            labels.push(`Day ${i}`);
            transactionsData.push(Math.floor(100 + Math.random() * 200));
            revenueData.push(Math.floor(30000 + Math.random() * 50000));
        }
    } else if (period === 'yearly') {
        // 12 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        labels = months;
        for (let i = 0; i < 12; i++) {
            transactionsData.push(Math.floor(2000 + Math.random() * 2000));
            revenueData.push(Math.floor(500000 + Math.random() * 500000));
        }
    }
    
    transactionsChart.data.labels = labels;
    transactionsChart.data.datasets[0].data = transactionsData;
    transactionsChart.data.datasets[1].data = revenueData;
    transactionsChart.update();
    
    // Update other charts as needed
    // This is simplified for the demo
}

// Update key metrics
function updateKeyMetrics(period) {
    // In a real application, this would fetch new data from the API
    // For now, we'll just update the metrics with random data
    
    let totalUsers, totalTransactions, totalRevenue, avgTopup;
    
    if (period === 'daily') {
        totalUsers = Math.floor(800 + Math.random() * 200);
        totalTransactions = Math.floor(1000 + Math.random() * 500);
        totalRevenue = `₦${(Math.floor(300000 + Math.random() * 100000) / 1000).toFixed(1)}K`;
        avgTopup = `₦${Math.floor(250 + Math.random() * 100)}`;
    } else if (period === 'weekly') {
        totalUsers = Math.floor(900 + Math.random() * 200);
        totalTransactions = Math.floor(2000 + Math.random() * 1000);
        totalRevenue = `₦${(Math.floor(600000 + Math.random() * 200000) / 1000).toFixed(1)}K`;
        avgTopup = `₦${Math.floor(280 + Math.random() * 100)}`;
    } else if (period === 'monthly') {
        totalUsers = Math.floor(1200 + Math.random() * 200);
        totalTransactions = Math.floor(3500 + Math.random() * 1000);
        totalRevenue = `₦${(Math.floor(1000000 + Math.random() * 500000) / 1000000).toFixed(1)}M`;
        avgTopup = `₦${Math.floor(300 + Math.random() * 100)}`;
    } else if (period === 'yearly') {
        totalUsers = Math.floor(5000 + Math.random() * 1000);
        totalTransactions = Math.floor(40000 + Math.random() * 10000);
        totalRevenue = `₦${(Math.floor(12000000 + Math.random() * 5000000) / 1000000).toFixed(1)}M`;
        avgTopup = `₦${Math.floor(320 + Math.random() * 100)}`;
    }
    
    document.getElementById('total-users').textContent = totalUsers.toLocaleString();
    document.getElementById('total-transactions').textContent = totalTransactions.toLocaleString();
    document.getElementById('total-revenue').textContent = totalRevenue;
    document.getElementById('avg-topup').textContent = avgTopup;
}

// Generate report
function generateReport() {
    const reportType = document.getElementById('report-type').value;
    const dateRange = document.getElementById('date-range').value;
    const groupBy = document.getElementById('group-by').value;
    const format = document.getElementById('format').value;
    
    // In a real application, this would make an API call to generate the report
    // For now, we'll just show a mock report
    
    if (format === 'table') {
        // Show report result
        document.getElementById('report-result').style.display = 'block';
        
        // Generate mock report data
        const reportTable = document.getElementById('report-table');
        reportTable.innerHTML = '';
        
        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        if (reportType === 'user') {
            headerRow.innerHTML = `
                <th>Date</th>
                <th>New Users</th>
                <th>Active Users</th>
                <th>Total Users</th>
                <th>Growth Rate</th>
            `;
        } else if (reportType === 'transaction') {
            headerRow.innerHTML = `
                <th>Date</th>
                <th>Transactions</th>
                <th>Total Amount</th>
                <th>Average Amount</th>
                <th>Points Generated</th>
            `;
        } else if (reportType === 'draw') {
            headerRow.innerHTML = `
                <th>Date</th>
                <th>Draw Type</th>
                <th>Participants</th>
                <th>Winners</th>
                <th>Prize Value</th>
            `;
        } else if (reportType === 'campaign') {
            headerRow.innerHTML = `
                <th>Campaign</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Participants</th>
                <th>Transactions</th>
                <th>Revenue</th>
            `;
        } else if (reportType === 'revenue') {
            headerRow.innerHTML = `
                <th>Date</th>
                <th>Revenue</th>
                <th>Commissions</th>
                <th>Prizes Paid</th>
                <th>Net Revenue</th>
            `;
        }
        
        thead.appendChild(headerRow);
        reportTable.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        // Generate mock data based on report type
        if (reportType === 'user') {
            for (let i = 1; i <= 10; i++) {
                const row = document.createElement('tr');
                const newUsers = Math.floor(10 + Math.random() * 50);
                const activeUsers = Math.floor(500 + Math.random() * 300);
                const totalUsers = 1000 + i * 50 + newUsers;
                const growthRate = ((newUsers / (totalUsers - newUsers)) * 100).toFixed(2);
                
                row.innerHTML = `
                    <td>Apr ${i}, 2025</td>
                    <td>${newUsers}</td>
                    <td>${activeUsers}</td>
                    <td>${totalUsers}</td>
                    <td>${growthRate}%</td>
                `;
                tbody.appendChild(row);
            }
        } else if (reportType === 'transaction') {
            for (let i = 1; i <= 10; i++) {
                const row = document.createElement('tr');
                const transactions = Math.floor(100 + Math.random() * 200);
                const totalAmount = Math.floor(30000 + Math.random() * 50000);
                const avgAmount = Math.floor(totalAmount / transactions);
                const points = Math.floor(transactions * 5 + Math.random() * 100);
                
                row.innerHTML = `
                    <td>Apr ${i}, 2025</td>
                    <td>${transactions}</td>
                    <td>₦${totalAmount.toLocaleString()}</td>
                    <td>₦${avgAmount}</td>
                    <td>${points}</td>
                `;
                tbody.appendChild(row);
            }
        } else if (reportType === 'draw') {
            for (let i = 1; i <= 10; i++) {
                const row = document.createElement('tr');
                const drawType = i % 7 === 0 ? 'Weekly Special' : 'Daily Draw';
                const participants = Math.floor(500 + Math.random() * 500);
                const winners = drawType === 'Weekly Special' ? 5 : 10;
                const prizeValue = drawType === 'Weekly Special' ? '₦250,000' : '₦50,000';
                
                row.innerHTML = `
                    <td>Apr ${i}, 2025</td>
                    <td>${drawType}</td>
                    <td>${participants}</td>
                    <td>${winners}</td>
                    <td>${prizeValue}</td>
                `;
                tbody.appendChild(row);
            }
        } else if (reportType === 'campaign') {
            const campaigns = [
                { name: 'April Top-Up Bonus', start: 'Apr 1, 2025', end: 'Apr 30, 2025' },
                { name: 'Weekend Special Draw', start: 'Apr 20, 2025', end: 'Apr 28, 2025' },
                { name: 'March Madness', start: 'Mar 1, 2025', end: 'Mar 31, 2025' },
                { name: 'Valentine\'s Special', start: 'Feb 10, 2025', end: 'Feb 14, 2025' },
                { name: 'New Year Kickoff', start: 'Jan 1, 2025', end: 'Jan 15, 2025' }
            ];
            
            campaigns.forEach(campaign => {
                const row = document.createElement('tr');
                const participants = Math.floor(200 + Math.random() * 300);
                const transactions = Math.floor(participants * 2 + Math.random() * 200);
                const revenue = Math.floor(transactions * 300 + Math.random() * 50000);
                
                row.innerHTML = `
                    <td>${campaign.name}</td>
                    <td>${campaign.start}</td>
                    <td>${campaign.end}</td>
                    <td>${participants}</td>
                    <td>${transactions}</td>
                    <td>₦${revenue.toLocaleString()}</td>
                `;
                tbody.appendChild(row);
            });
        } else if (reportType === 'revenue') {
            for (let i = 1; i <= 10; i++) {
                const row = document.createElement('tr');
                const revenue = Math.floor(100000 + Math.random() * 50000);
                const commissions = Math.floor(revenue * 0.1);
                const prizes = Math.floor(revenue * 0.3);
                const netRevenue = revenue - commissions - prizes;
                
                row.innerHTML = `
                    <td>Apr ${i}, 2025</td>
                    <td>₦${revenue.toLocaleString()}</td>
                    <td>₦${commissions.toLocaleString()}</td>
                    <td>₦${prizes.toLocaleString()}</td>
                    <td>₦${netRevenue.toLocaleString()}</td>
                `;
                tbody.appendChild(row);
            }
        }
        
        reportTable.appendChild(tbody);
    } else {
        // For other formats, just show an alert
        alert(`Report would be generated in ${format.toUpperCase()} format`);
    }
}

// Save report
function saveReport() {
    // In a real application, this would save the report configuration
    alert('Report configuration saved!');
}

// Show draw details modal
function showDrawDetailsModal(drawDate, drawType) {
    // Set modal title
    document.getElementById('drawDetailsModalLabel').textContent = `${drawDate} - ${drawType} Details`;
    
    // Set draw details
    document.getElementById('detail-draw-date').textContent = drawDate;
    document.getElementById('detail-draw-type').textContent = drawType;
    
    // Set draw statistics
    let participants = 856;
    let winners = 10;
    let prizeValue = '₦50,000';
    
    if (drawType === 'Weekly Special') {
        participants = 1245;
        winners = 5;
        prizeValue = '₦250,000';
    }
    
    document.getElementById('detail-participants').textContent = participants;
    document.getElementById('detail-winners').textContent = winners;
    document.getElementById('detail-prize-value').textContent = prizeValue;
    
    // Populate winners table
    const winnersTable = document.getElementById('winners-table');
    winnersTable.innerHTML = '';
    
    // Generate mock winners
    const mockWinners = generateMockWinners(winners);
    
    mockWinners.forEach(winner => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${winner.msisdn}</td>
            <td>${winner.prize}</td>
            <td>${winner.points}</td>
            <td><span class="badge ${winner.status === 'Claimed' ? 'bg-success' : 'bg-warning'}">${winner.status}</span></td>
        `;
        winnersTable.appendChild(row);
    });
    
    // Create demographics chart
    createDemographicsChart();
    
    // Create draw top-up chart
    createDrawTopupChart();
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('drawDetailsModal'));
    modal.show();
}

// Generate mock winners
function generateMockWinners(count) {
    const winners = [];
    const prizes = ['₦10,000', '₦5,000', '₦2,000', '₦1,000', '₦500'];
    const statuses = ['Claimed', 'Pending'];
    
    for (let i = 0; i < count; i++) {
        winners.push({
            msisdn: `234${Math.floor(7000000000 + Math.random() * 1000000000)}`,
            prize: i < prizes.length ? prizes[i] : prizes[Math.floor(Math.random() * prizes.length)],
            points: Math.floor(20 + Math.random() * 80),
            status: Math.random() > 0.3 ? 'Claimed' : 'Pending'
        });
    }
    
    return winners;
}

// Create demographics chart
function createDemographicsChart() {
    // Destroy existing chart if it exists
    if (demographicsChart) {
        demographicsChart.destroy();
    }
    
    // Get chart canvas
    const ctx = document.getElementById('demographics-chart').getContext('2d');
    
    demographicsChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Others'],
            datasets: [{
                data: [30, 20, 15, 10, 10, 15],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

// Create draw top-up chart
function createDrawTopupChart() {
    // Destroy existing chart if it exists
    if (drawTopupChart) {
        drawTopupChart.destroy();
    }
    
    // Get chart canvas
    const ctx = document.getElementById('draw-topup-chart').getContext('2d');
    
    drawTopupChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['₦100-199', '₦200-299', '₦300-399', '₦400-499', '₦500-599', '₦600+'],
            datasets: [{
                label: 'Participants',
                data: [250, 200, 150, 100, 80, 76],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Participants'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Export draw details
function exportDrawDetails() {
    // In a real application, this would generate a CSV or Excel file
    alert('Draw details exported!');
}
