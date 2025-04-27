/**
 * Template Loading Fix for Bridgetunes MTN Admin Portal
 * 
 * This script fixes the template loading issues by embedding the templates directly
 * in the JavaScript rather than loading them via fetch requests, which can fail
 * due to CORS issues or path resolution problems.
 */

// Store templates directly in JavaScript
const templates = {
    dashboard: `
        <div class="dashboard-stats">
            <div class="row">
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-card-header">
                            <i class="fas fa-users"></i>
                            <h4>Total Users</h4>
                        </div>
                        <div class="stat-card-body">
                            <h2 id="total-users">12,458</h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-card-header">
                            <i class="fas fa-user-check"></i>
                            <h4>Active Users</h4>
                        </div>
                        <div class="stat-card-body">
                            <h2 id="active-users">8,976</h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-card-header">
                            <i class="fas fa-random"></i>
                            <h4>Total Draws</h4>
                        </div>
                        <div class="stat-card-body">
                            <h2 id="total-draws">124</h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-card-header">
                            <i class="fas fa-trophy"></i>
                            <h4>Total Winners</h4>
                        </div>
                        <div class="stat-card-body">
                            <h2 id="total-winners">1,240</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-card-header">
                            <i class="fas fa-bell"></i>
                            <h4>Notifications</h4>
                        </div>
                        <div class="stat-card-body">
                            <h2 id="total-notifications">78,945</h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-card-header">
                            <i class="fas fa-bullhorn"></i>
                            <h4>Active Campaigns</h4>
                        </div>
                        <div class="stat-card-body">
                            <h2 id="active-campaigns">12</h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="stat-card">
                        <div class="stat-card-header">
                            <i class="fas fa-money-bill-wave"></i>
                            <h4>Current Jackpot</h4>
                        </div>
                        <div class="stat-card-body">
                            <h2 id="current-jackpot">₦5,000,000</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5>Recent Activity</h5>
                    </div>
                    <div class="card-body">
                        <ul class="activity-list" id="recent-activity-list">
                            <li class="activity-item">
                                <div class="activity-icon success">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="activity-details">
                                    <div class="activity-title">Admin executed draw</div>
                                    <div class="activity-time">1 hour ago</div>
                                </div>
                            </li>
                            <li class="activity-item">
                                <div class="activity-icon success">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="activity-details">
                                    <div class="activity-title">System processed topups</div>
                                    <div class="activity-time">2 hours ago</div>
                                </div>
                            </li>
                            <li class="activity-item">
                                <div class="activity-icon success">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="activity-details">
                                    <div class="activity-title">Admin sent campaign</div>
                                    <div class="activity-time">3 hours ago</div>
                                </div>
                            </li>
                            <li class="activity-item">
                                <div class="activity-icon success">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="activity-details">
                                    <div class="activity-title">Admin created template</div>
                                    <div class="activity-time">1 day ago</div>
                                </div>
                            </li>
                            <li class="activity-item">
                                <div class="activity-icon success">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="activity-details">
                                    <div class="activity-title">System backup database</div>
                                    <div class="activity-time">2 days ago</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5>Upcoming Draws</h5>
                    </div>
                    <div class="card-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Jackpot</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Today</td>
                                    <td>8:00 PM</td>
                                    <td>₦1,000,000</td>
                                    <td><span class="badge bg-warning">Scheduled</span></td>
                                </tr>
                                <tr>
                                    <td>Tomorrow</td>
                                    <td>8:00 PM</td>
                                    <td>₦1,000,000</td>
                                    <td><span class="badge bg-warning">Scheduled</span></td>
                                </tr>
                                <tr>
                                    <td>Saturday</td>
                                    <td>8:00 PM</td>
                                    <td>₦3,000,000</td>
                                    <td><span class="badge bg-warning">Scheduled</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `,
    notification: `
        <div class="row mb-4">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h5>Notification Management</h5>
                    </div>
                    <div class="card-body">
                        <ul class="nav nav-tabs" id="notificationTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="campaigns-tab" data-bs-toggle="tab" data-bs-target="#campaigns" type="button" role="tab" aria-controls="campaigns" aria-selected="true">Campaigns</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="templates-tab" data-bs-toggle="tab" data-bs-target="#templates" type="button" role="tab" aria-controls="templates" aria-selected="false">Templates</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="segments-tab" data-bs-toggle="tab" data-bs-target="#segments" type="button" role="tab" aria-controls="segments" aria-selected="false">Segments</button>
                            </li>
                        </ul>
                        <div class="tab-content" id="notificationTabsContent">
                            <div class="tab-pane fade show active" id="campaigns" role="tabpanel" aria-labelledby="campaigns-tab">
                                <div class="d-flex justify-content-between align-items-center mt-3 mb-3">
                                    <h6>Campaigns</h6>
                                    <button class="btn btn-primary" id="create-campaign-btn">
                                        <i class="fas fa-plus"></i> Create Campaign
                                    </button>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-striped" id="campaigns-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Status</th>
                                                <th>Sent</th>
                                                <th>Delivered</th>
                                                <th>Failed</th>
                                                <th>Created</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="campaigns-table-body">
                                            <tr>
                                                <td>Welcome Campaign</td>
                                                <td><span class="badge bg-success">active</span></td>
                                                <td>1,200</td>
                                                <td>1,150</td>
                                                <td>50</td>
                                                <td>2023-01-15</td>
                                                <td>
                                                    <button class="btn btn-sm btn-info"><i class="fas fa-edit"></i></button>
                                                    <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Daily Draw Reminder</td>
                                                <td><span class="badge bg-success">active</span></td>
                                                <td>5,000</td>
                                                <td>4,800</td>
                                                <td>200</td>
                                                <td>2023-02-10</td>
                                                <td>
                                                    <button class="btn btn-sm btn-info"><i class="fas fa-edit"></i></button>
                                                    <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Winner Notification</td>
                                                <td><span class="badge bg-success">active</span></td>
                                                <td>500</td>
                                                <td>490</td>
                                                <td>10</td>
                                                <td>2023-03-05</td>
                                                <td>
                                                    <button class="btn btn-sm btn-info"><i class="fas fa-edit"></i></button>
                                                    <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="templates" role="tabpanel" aria-labelledby="templates-tab">
                                <div class="d-flex justify-content-between align-items-center mt-3 mb-3">
                                    <h6>Templates</h6>
                                    <button class="btn btn-primary" id="create-template-btn">
                                        <i class="fas fa-plus"></i> Create Template
                                    </button>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-striped" id="templates-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Content</th>
                                                <th>Created</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="templates-table-body">
                                            <tr>
                                                <td>Welcome Template</td>
                                                <td>welcome</td>
                                                <td>Welcome to Bridgetunes, {{name}}!</td>
                                                <td>2023-01-10</td>
                                                <td>
                                                    <button class="btn btn-sm btn-info"><i class="fas fa-edit"></i></button>
                                                    <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Draw Reminder</td>
                                                <td>reminder</td>
                                                <td>Reminder: Today's draw is at 8 PM. Top up to qualify!</td>
                                                <td>2023-02-05</td>
                                                <td>
                                                    <button class="btn btn-sm btn-info"><i class="fas fa-edit"></i></button>
                                                    <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Winner Notification</td>
                                                <td>winner</td>
                                                <td>Congratulations, {{name}}! You won ₦{{amount}} in today's draw.</td>
                                                <td>2023-03-01</td>
                                                <td>
                                                    <button class="btn btn-sm btn-info"><i class="fas fa-edit"></i></button>
                                                    <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="segments" role="tabpanel" aria-labelledby="segments-tab">
                                <div class="d-flex justify-content-between align-items-center mt-3 mb-3">
                                    <h6>Segments</h6>
                                    <button class="btn btn-primary" id="create-segment-btn">
                                        <i class="fas fa-plus"></i> Create Segment
                                    </button>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Criteria</th>
                                                <th>Count</th>
                                                <th>Created</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Active Users</td>
                                                <td>Users who have topped up in the last 7 days</td>
                                                <td>5,432</td>
                                                <td>2023-01-15</td>
                                                <td>
                                                    <button class="btn btn-sm btn-info"><i class="fas fa-edit"></i></button>
                                                    <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>High Value Users</td>
                                                <td>Users who have topped up ₦1,000+ in the last 30 days</td>
                                                <td>2,345</td>
                                                <td>2023-02-10</td>
                                                <td>
                                                    <button class="btn btn-sm btn-info"><i class="fas fa-edit"></i></button>
                                                    <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Inactive Users</td>
                                                <td>Users who have not topped up in the last 30 days</td>
                                                <td>3,456</td>
                                                <td>2023-03-05</td>
                                                <td>
                                                    <button class="btn btn-sm btn-info"><i class="fas fa-edit"></i></button>
                                                    <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Campaign Modal -->
        <div class="modal fade" id="campaign-modal" tabindex="-1" aria-labelledby="campaign-modal-label" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="campaign-modal-label">Create Campaign</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="campaign-form">
                            <div class="mb-3">
                                <label for="campaign-name" class="form-label">Campaign Name</label>
                                <input type="text" class="form-control" id="campaign-name" placeholder="Enter campaign name">
                            </div>
                            <div class="mb-3">
                                <label for="campaign-template" class="form-label">Template</label>
                                <select class="form-select" id="campaign-template">
                                    <option value="">Select template</option>
                                    <option value="1">Welcome Template</option>
                                    <option value="2">Draw Reminder</option>
                                    <option value="3">Winner Notification</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="campaign-segment" class="form-label">Segment</label>
                                <select class="form-select" id="campaign-segment">
                                    <option value="">Select segment</option>
                                    <option value="1">Active Users</option>
                                    <option value="2">High Value Users</option>
                                    <option value="3">Inactive Users</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="campaign-schedule" class="form-label">Schedule</label>
                                <select class="form-select" id="campaign-schedule">
                                    <option value="now">Send immediately</option>
                                    <option value="later">Schedule for later</option>
                                </select>
                            </div>
                            <div class="mb-3" id="schedule-date-container" style="display: none;">
                                <label for="campaign-date" class="form-label">Date</label>
                                <input type="date" class="form-control" id="campaign-date">
                            </div>
                            <div class="mb-3" id="schedule-time-container" style="display: none;">
                                <label for="campaign-time" class="form-label">Time</label>
                                <input type="time" class="form-control" id="campaign-time">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="save-campaign-btn">Create Campaign</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Template Modal -->
        <div class="modal fade" id="template-modal" tabindex="-1" aria-labelledby="template-modal-label" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="template-modal-label">Create Template</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="template-form">
                            <div class="mb-3">
                                <label for="template-name" class="form-label">Template Name</label>
                                <input type="text" class="form-control" id="template-name" placeholder="Enter template name">
                            </div>
                            <div class="mb-3">
                                <label for="template-type" class="form-label">Template Type</label>
                                <select class="form-select" id="template-type">
                                    <option value="">Select type</option>
                                    <option value="welcome">Welcome</option>
                                    <option value="reminder">Reminder</option>
                                    <option value="winner">Winner</option>
                                    <option value="jackpot">Jackpot</option>
                                    <option value="re-engagement">Re-engagement</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="template-content" class="form-label">Content</label>
                                <textarea class="form-control" id="template-content" rows="5" placeholder="Enter template content"></textarea>
                                <small class="form-text text-muted">You can use {{name}}, {{amount}}, and other variables in your template.</small>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="save-template-btn">Create Template</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Segment Modal -->
        <div class="modal fade" id="segment-modal" tabindex="-1" aria-labelledby="segment-modal-label" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="segment-modal-label">Create Segment</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="segment-form">
                            <div class="mb-3">
                                <label for="segment-name" class="form-label">Segment Name</label>
                                <input type="text" class="form-control" id="segment-name" placeholder="Enter segment name">
                            </div>
                            <div class="mb-3">
                                <label for="segment-criteria" class="form-label">Criteria</label>
                                <select class="form-select" id="segment-criteria">
                                    <option value="">Select criteria</option>
                                    <option value="active">Active users</option>
                                    <option value="inactive">Inactive users</option>
                                    <option value="high-value">High value users</option>
                                    <option value="low-value">Low value users</option>
                                    <option value="custom">Custom criteria</option>
                                </select>
                            </div>
                            <div class="mb-3" id="custom-criteria-container" style="display: none;">
                                <label for="custom-criteria" class="form-label">Custom Criteria</label>
                                <textarea class="form-control" id="custom-criteria" rows="3" placeholder="Enter custom criteria"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="save-segment-btn">Create Segment</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    draw: `
        <div class="row mb-4">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h5>Draw Management</h5>
                    </div>
                    <div class="card-body">
                        <ul class="nav nav-tabs" id="drawTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="draw-execution-tab" data-bs-toggle="tab" data-bs-target="#draw-execution" type="button" role="tab" aria-controls="draw-execution" aria-selected="true">Draw Execution</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="draw-history-tab" data-bs-toggle="tab" data-bs-target="#draw-history" type="button" role="tab" aria-controls="draw-history" aria-selected="false">Draw History</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="jackpot-config-tab" data-bs-toggle="tab" data-bs-target="#jackpot-config" type="button" role="tab" aria-controls="jackpot-config" aria-selected="false">Jackpot Configuration</button>
                            </li>
                        </ul>
                        <div class="tab-content" id="drawTabsContent">
                            <div class="tab-pane fade show active" id="draw-execution" role="tabpanel" aria-labelledby="draw-execution-tab">
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <div class="card">
                                            <div class="card-header">
                                                <h6>Draw Configuration</h6>
                                            </div>
                                            <div class="card-body">
                                                <form id="draw-config-form">
                                                    <div class="mb-3">
                                                        <label for="draw-date" class="form-label">Draw Date</label>
                                                        <input type="date" class="form-control" id="draw-date">
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="filter-type" class="form-label">Filter Type</label>
                                                        <select class="form-select" id="filter-type">
                                                            <option value="all">All Numbers</option>
                                                            <option value="ending">Numbers Ending With</option>
                                                        </select>
                                                    </div>
                                                    <div class="mb-3" id="ending-digits-container" style="display: none;">
                                                        <label for="ending-digits" class="form-label">Ending Digits</label>
                                                        <div class="row">
                                                            <div class="col">
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="checkbox" value="0" id="digit-0">
                                                                    <label class="form-check-label" for="digit-0">0</label>
                                                                </div>
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="checkbox" value="1" id="digit-1">
                                                                    <label class="form-check-label" for="digit-1">1</label>
                                                                </div>
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="checkbox" value="2" id="digit-2">
                                                                    <label class="form-check-label" for="digit-2">2</label>
                                                                </div>
                                                            </div>
                                                            <div class="col">
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="checkbox" value="3" id="digit-3">
                                                                    <label class="form-check-label" for="digit-3">3</label>
                                                                </div>
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="checkbox" value="4" id="digit-4">
                                                                    <label class="form-check-label" for="digit-4">4</label>
                                                                </div>
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="checkbox" value="5" id="digit-5">
                                                                    <label class="form-check-label" for="digit-5">5</label>
                                                                </div>
                                                            </div>
                                                            <div class="col">
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="checkbox" value="6" id="digit-6">
                                                                    <label class="form-check-label" for="digit-6">6</label>
                                                                </div>
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="checkbox" value="7" id="digit-7">
                                                                    <label class="form-check-label" for="digit-7">7</label>
                                                                </div>
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="checkbox" value="8" id="digit-8">
                                                                    <label class="form-check-label" for="digit-8">8</label>
                                                                </div>
                                                            </div>
                                                            <div class="col">
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="checkbox" value="9" id="digit-9">
                                                                    <label class="form-check-label" for="digit-9">9</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="jackpot-amount" class="form-label">Jackpot Amount</label>
                                                        <input type="number" class="form-control" id="jackpot-amount" value="1000000">
                                                    </div>
                                                    <div class="d-grid gap-2">
                                                        <button type="button" class="btn btn-info" id="preview-eligible-btn">
                                                            <i class="fas fa-eye"></i> Preview Eligible Numbers
                                                        </button>
                                                        <button type="button" class="btn btn-primary" id="run-draw-btn">
                                                            <i class="fas fa-random"></i> Run Draw
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card">
                                            <div class="card-header">
                                                <h6>Draw Results</h6>
                                            </div>
                                            <div class="card-body" id="draw-result-container">
                                                <div class="text-center">
                                                    <p>No draw results to display. Run a draw to see results.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card mt-3">
                                            <div class="card-header">
                                                <h6>Eligible Numbers</h6>
                                            </div>
                                            <div class="card-body" id="eligible-numbers-container">
                                                <div class="text-center">
                                                    <p>No eligible numbers to display. Preview eligible numbers to see results.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="draw-history" role="tabpanel" aria-labelledby="draw-history-tab">
                                <div class="d-flex justify-content-between align-items-center mt-3 mb-3">
                                    <h6>Draw History</h6>
                                    <div>
                                        <button class="btn btn-info">
                                            <i class="fas fa-file-export"></i> Export
                                        </button>
                                    </div>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-striped" id="draws-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Winners</th>
                                                <th>Jackpot Amount</th>
                                                <th>Eligible Numbers</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="draws-table-body">
                                            <tr>
                                                <td>2023-04-26</td>
                                                <td><span class="badge bg-success">completed</span></td>
                                                <td>10</td>
                                                <td>₦1,000,000</td>
                                                <td>5,000</td>
                                                <td>
                                                    <button class="btn btn-sm btn-info"><i class="fas fa-eye"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2023-04-25</td>
                                                <td><span class="badge bg-success">completed</span></td>
                                                <td>8</td>
                                                <td>₦1,000,000</td>
                                                <td>4,800</td>
                                                <td>
                                                    <button class="btn btn-sm btn-info"><i class="fas fa-eye"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2023-04-24</td>
                                                <td><span class="badge bg-success">completed</span></td>
                                                <td>12</td>
                                                <td>₦1,000,000</td>
                                                <td>5,200</td>
                                                <td>
                                                    <button class="btn btn-sm btn-info"><i class="fas fa-eye"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2023-04-28</td>
                                                <td><span class="badge bg-warning">scheduled</span></td>
                                                <td>0</td>
                                                <td>₦1,000,000</td>
                                                <td>0</td>
                                                <td>
                                                    <button class="btn btn-sm btn-info"><i class="fas fa-eye"></i></button>
                                                    <button class="btn btn-sm btn-success"><i class="fas fa-play"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="jackpot-config" role="tabpanel" aria-labelledby="jackpot-config-tab">
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <div class="card">
                                            <div class="card-header">
                                                <h6>Jackpot Configuration</h6>
                                            </div>
                                            <div class="card-body">
                                                <form id="jackpot-config-form">
                                                    <div class="mb-3">
                                                        <label for="daily-jackpot" class="form-label">Daily Jackpot Amount</label>
                                                        <input type="number" class="form-control" id="daily-jackpot" value="1000000">
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="saturday-jackpot" class="form-label">Saturday Jackpot Amount</label>
                                                        <input type="number" class="form-control" id="saturday-jackpot" value="3000000">
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="minimum-topup" class="form-label">Minimum Top-up Amount</label>
                                                        <input type="number" class="form-control" id="minimum-topup" value="100">
                                                    </div>
                                                    <div class="d-grid gap-2">
                                                        <button type="submit" class="btn btn-primary">
                                                            <i class="fas fa-save"></i> Save Configuration
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card">
                                            <div class="card-header">
                                                <h6>Rollover Configuration</h6>
                                            </div>
                                            <div class="card-body">
                                                <form id="rollover-config-form">
                                                    <div class="mb-3">
                                                        <label for="rollover-enabled" class="form-label">Enable Rollover</label>
                                                        <select class="form-select" id="rollover-enabled">
                                                            <option value="1">Yes</option>
                                                            <option value="0">No</option>
                                                        </select>
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="rollover-percentage" class="form-label">Rollover Percentage: <span id="rollover-percentage-value">50%</span></label>
                                                        <input type="range" class="form-range" min="0" max="100" step="5" id="rollover-percentage" value="50">
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="max-rollover" class="form-label">Maximum Rollover Amount</label>
                                                        <input type="number" class="form-control" id="max-rollover" value="10000000">
                                                    </div>
                                                    <div class="d-grid gap-2">
                                                        <button type="submit" class="btn btn-primary">
                                                            <i class="fas fa-save"></i> Save Configuration
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Confirm Draw Modal -->
        <div class="modal fade" id="confirm-draw-modal" tabindex="-1" aria-labelledby="confirm-draw-modal-label" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirm-draw-modal-label">Confirm Draw Execution</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to run the draw? This action cannot be undone.</p>
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle"></i> Running a draw will select winners from eligible numbers and notify them automatically.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirm-draw-btn">Run Draw</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    user: `
        <div class="row mb-4">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h5>User Management</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="d-flex">
                                <input type="text" class="form-control me-2" placeholder="Search users...">
                                <button class="btn btn-outline-primary">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                            <button class="btn btn-primary" id="create-user-btn">
                                <i class="fas fa-plus"></i> Create User
                            </button>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-striped" id="users-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email/MSISDN</th>
                                        <th>Type</th>
                                        <th>Organization</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="users-table-body">
                                    <tr>
                                        <td>John Doe</td>
                                        <td>+2348012345678</td>
                                        <td><span class="badge bg-primary">public</span></td>
                                        <td>N/A</td>
                                        <td><span class="badge bg-success">active</span></td>
                                        <td>2023-01-15</td>
                                        <td>
                                            <button class="btn btn-sm btn-info"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-sm btn-warning"><i class="fas fa-key"></i></button>
                                            <button class="btn btn-sm btn-danger"><i class="fas fa-ban"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Admin User</td>
                                        <td>admin@bridgetunes.com</td>
                                        <td><span class="badge bg-danger">admin</span></td>
                                        <td>Bridgetunes</td>
                                        <td><span class="badge bg-success">active</span></td>
                                        <td>2022-10-05</td>
                                        <td>
                                            <button class="btn btn-sm btn-info"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-sm btn-warning"><i class="fas fa-key"></i></button>
                                            <button class="btn btn-sm btn-danger"><i class="fas fa-ban"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>MTN Staff</td>
                                        <td>staff@mtn.com</td>
                                        <td><span class="badge bg-warning">staff</span></td>
                                        <td>MTN</td>
                                        <td><span class="badge bg-success">active</span></td>
                                        <td>2022-11-20</td>
                                        <td>
                                            <button class="btn btn-sm btn-info"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-sm btn-warning"><i class="fas fa-key"></i></button>
                                            <button class="btn btn-sm btn-danger"><i class="fas fa-ban"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Mike Johnson</td>
                                        <td>+2348034567890</td>
                                        <td><span class="badge bg-primary">public</span></td>
                                        <td>N/A</td>
                                        <td><span class="badge bg-danger">inactive</span></td>
                                        <td>2022-12-10</td>
                                        <td>
                                            <button class="btn btn-sm btn-info"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-sm btn-warning"><i class="fas fa-key"></i></button>
                                            <button class="btn btn-sm btn-success"><i class="fas fa-check"></i></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <nav aria-label="Page navigation">
                            <ul class="pagination justify-content-center mt-3">
                                <li class="page-item disabled">
                                    <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                                </li>
                                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                <li class="page-item"><a class="page-link" href="#">2</a></li>
                                <li class="page-item"><a class="page-link" href="#">3</a></li>
                                <li class="page-item">
                                    <a class="page-link" href="#">Next</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <!-- User Modal -->
        <div class="modal fade" id="user-modal" tabindex="-1" aria-labelledby="user-modal-label" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="user-modal-label">Create User</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="user-form">
                            <div class="mb-3">
                                <label for="user-name" class="form-label">Name</label>
                                <input type="text" class="form-control" id="user-name" placeholder="Enter name">
                            </div>
                            <div class="mb-3">
                                <label for="user-type" class="form-label">User Type</label>
                                <select class="form-select" id="user-type">
                                    <option value="public">Public</option>
                                    <option value="admin">Admin</option>
                                    <option value="staff">Staff</option>
                                </select>
                            </div>
                            <div class="mb-3" id="msisdn-field">
                                <label for="user-msisdn" class="form-label">MSISDN</label>
                                <input type="text" class="form-control" id="user-msisdn" placeholder="Enter MSISDN">
                            </div>
                            <div class="mb-3" id="email-field">
                                <label for="user-email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="user-email" placeholder="Enter email">
                            </div>
                            <div class="mb-3" id="organization-field" style="display: none;">
                                <label for="user-organization" class="form-label">Organization</label>
                                <input type="text" class="form-control" id="user-organization" placeholder="Enter organization">
                            </div>
                            <div class="mb-3">
                                <label for="user-password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="user-password" placeholder="Enter password">
                            </div>
                            <div class="mb-3">
                                <label for="user-confirm-password" class="form-label">Confirm Password</label>
                                <input type="password" class="form-control" id="user-confirm-password" placeholder="Confirm password">
                            </div>
                            <div class="mb-3">
                                <label for="user-status" class="form-label">Status</label>
                                <select class="form-select" id="user-status">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="save-user-btn">Create User</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    transaction: `
        <div class="row mb-4">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h5>Transaction Management</h5>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-md-8">
                                <div class="d-flex">
                                    <div class="me-2">
                                        <label for="transaction-date-from" class="form-label">From</label>
                                        <input type="date" class="form-control" id="transaction-date-from">
                                    </div>
                                    <div class="me-2">
                                        <label for="transaction-date-to" class="form-label">To</label>
                                        <input type="date" class="form-control" id="transaction-date-to">
                                    </div>
                                    <div class="me-2">
                                        <label for="transaction-status" class="form-label">Status</label>
                                        <select class="form-select" id="transaction-status">
                                            <option value="">All</option>
                                            <option value="processed">Processed</option>
                                            <option value="pending">Pending</option>
                                            <option value="failed">Failed</option>
                                        </select>
                                    </div>
                                    <div class="align-self-end">
                                        <button class="btn btn-primary">
                                            <i class="fas fa-search"></i> Filter
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 text-end align-self-end">
                                <button class="btn btn-success" id="export-transactions-btn">
                                    <i class="fas fa-file-export"></i> Export
                                </button>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-striped" id="transactions-table">
                                <thead>
                                    <tr>
                                        <th>MSISDN</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="transactions-table-body">
                                    <tr>
                                        <td>+2348012345678</td>
                                        <td>₦500</td>
                                        <td>2023-04-26</td>
                                        <td><span class="badge bg-success">processed</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-info"><i class="fas fa-eye"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>+2348023456789</td>
                                        <td>₦1,000</td>
                                        <td>2023-04-25</td>
                                        <td><span class="badge bg-success">processed</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-info"><i class="fas fa-eye"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>+2348034567890</td>
                                        <td>₦200</td>
                                        <td>2023-04-24</td>
                                        <td><span class="badge bg-success">processed</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-info"><i class="fas fa-eye"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>+2348045678901</td>
                                        <td>₦5,000</td>
                                        <td>2023-04-23</td>
                                        <td><span class="badge bg-success">processed</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-info"><i class="fas fa-eye"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>+2348056789012</td>
                                        <td>₦100</td>
                                        <td>2023-04-22</td>
                                        <td><span class="badge bg-success">processed</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-info"><i class="fas fa-eye"></i></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <nav aria-label="Page navigation">
                            <ul class="pagination justify-content-center mt-3">
                                <li class="page-item disabled">
                                    <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                                </li>
                                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                <li class="page-item"><a class="page-link" href="#">2</a></li>
                                <li class="page-item"><a class="page-link" href="#">3</a></li>
                                <li class="page-item">
                                    <a class="page-link" href="#">Next</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    `
};

/**
 * Load template content directly instead of fetching from server
 * @param {string} templateName - Name of the template to load
 * @param {string} containerId - ID of the container to load the template into
 */
function loadTemplateContent(templateName, containerId) {
    console.log(`Loading ${templateName} template content into ${containerId}...`);
    
    // Get container element
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
    }
    
    // Get template content
    const templateContent = templates[templateName];
    if (!templateContent) {
        console.error(`Template ${templateName} not found`);
        container.innerHTML = `
            <div class="alert alert-danger">
                <h4>Error Loading Template</h4>
                <p>The template "${templateName}" could not be found.</p>
            </div>
        `;
        return;
    }
    
    // Set container content
    container.innerHTML = templateContent;
    
    // Initialize components based on template
    switch(templateName) {
        case 'dashboard':
            initializeDashboardComponents();
            break;
        case 'notification':
            initializeNotificationComponents();
            break;
        case 'draw':
            initializeDrawComponents();
            break;
        case 'user':
            initializeUserComponents();
            break;
        case 'transaction':
            initializeTransactionComponents();
            break;
    }
}

/**
 * Override the loadContentForCurrentPage function in admin-portal-integration.js
 * to use direct template loading instead of fetch
 */
function overrideLoadContentForCurrentPage() {
    console.log('Overriding loadContentForCurrentPage function...');
    
    // Store original function if it exists
    const originalLoadContentForCurrentPage = window.loadContentForCurrentPage;
    
    // Override function
    window.loadContentForCurrentPage = function() {
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
                loadTemplateContent('notification', 'notification-container');
                break;
            case 'draw':
                loadTemplateContent('draw', 'draw-container');
                break;
            case 'user':
                loadTemplateContent('user', 'user-container');
                break;
            case 'transaction':
                loadTemplateContent('transaction', 'transaction-container');
                break;
            case 'dashboard':
            default:
                loadTemplateContent('dashboard', 'dashboard-container');
                break;
        }
    };
    
    // Call the overridden function to load initial content
    window.loadContentForCurrentPage();
}

/**
 * Initialize the template loading fix
 */
function initializeTemplateLoadingFix() {
    console.log('Initializing Template Loading Fix...');
    
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token') || localStorage.getItem('bridgetunes_auth_token');
    if (token) {
        console.log('User is authenticated, applying template loading fix...');
        
        // Override loadContentForCurrentPage function
        overrideLoadContentForCurrentPage();
    } else {
        console.log('User is not authenticated, waiting for login...');
    }
}

// Initialize the template loading fix when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTemplateLoadingFix();
});

// Also initialize when the admin portal is initialized
const originalInitializeAdminPortal = window.initializeAdminPortal;
if (originalInitializeAdminPortal) {
    window.initializeAdminPortal = function() {
        originalInitializeAdminPortal();
        initializeTemplateLoadingFix();
    };
}

// Add event listener for authentication events
window.addEventListener('storage', function(e) {
    if (e.key === 'auth_token' || e.key === 'bridgetunes_auth_token') {
        if (e.newValue) {
            console.log('User authenticated, applying template loading fix...');
            initializeTemplateLoadingFix();
        }
    }
});

// If already on dashboard page, initialize immediately
if (document.getElementById('dashboard-page') && document.getElementById('dashboard-page').style.display !== 'none') {
    initializeTemplateLoadingFix();
}
