// This script will update all HTML files in the admin frontend to have consistent navigation
// Save this as update_navigation.js in the same folder as your extracted admin frontend files

const fs = require('fs');
const path = require('path');

// The consistent navigation code to use across all pages
const navigationCode = `<!-- Sidebar -->
<nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse">
    <div class="position-sticky pt-3">
        <div class="text-center mb-4">
            <h4 class="text-white">Bridgetunes MTN</h4>
            <p class="text-white-50">Admin Portal</p>
        </div>
        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link" href="index.html">
                    Dashboard
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="user-management.html">
                    User Management
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="csv-upload.html">
                    CSV Upload
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="transactions.html">
                    Transactions
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="draw-engine.html">
                    Draw Engine
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="notifications.html">
                    Notifications
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="campaigns.html">
                    Campaigns
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="analytics.html">
                    Analytics
                </a>
            </li>
            <li class="nav-item mt-5">
                <a class="nav-link text-danger" href="#" id="logout-link">
                    Logout
                </a>
            </li>
        </ul>
    </div>
</nav>`;

// List of HTML files to update
const htmlFiles = [
  'index.html',
  'draw-engine.html',
  'notifications.html',
  'campaigns.html',
  'analytics.html',
  'user-management.html',
  'csv-upload.html',
  'transactions.html'
];

// Update each file
htmlFiles.forEach(file => {
  try {
    const filePath = path.join(__dirname, file);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${file}`);
      return;
    }
    
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace navigation section
    const navRegex = /<nav id="sidebar"[\s\S]*?<\/nav>/;
    
    // Add active class to current page link
    let pageSpecificNav = navigationCode.replace(`href="${file}"`, `href="${file}" class="active"`);
    
    if (navRegex.test(content)) {
      content = content.replace(navRegex, pageSpecificNav);
      
      // Write updated content back to file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated navigation in ${file}`);
    } else {
      console.log(`Navigation section not found in ${file}`);
    }
  } catch (error) {
    console.error(`Error updating ${file}:`, error.message);
  }
});

console.log('Navigation update complete!');
