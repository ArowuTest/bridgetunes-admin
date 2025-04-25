// This script will help you update all the API URLs in the JavaScript files
// Save this as update_api_urls.js in the same folder as your extracted admin frontend files

const fs = require('fs');
const path = require('path');

// Enter your backend URL here
const YOUR_BACKEND_URL = 'https://bridgetunes-mtn-backend.onrender.com/api';

// List of JavaScript files to update
const jsFiles = [
  'app.js',
  'draw-engine.js',
  'notifications.js',
  'campaigns.js',
  'analytics.js'
];

// Update each file
jsFiles.forEach(file => {
  try {
    const filePath = path.join(__dirname, file);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${file}`);
      return;
    }
    
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace API URL
    const regex = /const API_BASE_URL = ['"].*['"]/;
    const newLine = `const API_BASE_URL = '${YOUR_BACKEND_URL}'`;
    
    if (regex.test(content)) {
      content = content.replace(regex, newLine);
      
      // Write updated content back to file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated API URL in ${file}`);
    } else {
      console.log(`API URL line not found in ${file}`);
    }
  } catch (error) {
    console.error(`Error updating ${file}:`, error.message);
  }
});

console.log('API URL update complete!');
