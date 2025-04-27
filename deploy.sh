#!/bin/bash

# Deployment script for Bridgetunes MTN Admin Portal

echo "Starting deployment of Bridgetunes MTN Admin Portal..."

# Create backup of original files
echo "Creating backup of original files..."
mkdir -p /home/ubuntu/backup
cp -r /home/ubuntu/user-frontend/public/js /home/ubuntu/backup/
cp /home/ubuntu/user-frontend/public/index.html /home/ubuntu/backup/

# Rename fixed files
echo "Renaming fixed files..."
cp /home/ubuntu/user-frontend/public/js/auth-service-fixed.js /home/ubuntu/user-frontend/public/js/auth-service.js
cp /home/ubuntu/user-frontend/public/js/admin-portal-integration-fixed.js /home/ubuntu/user-frontend/public/js/admin-portal-integration.js
cp /home/ubuntu/user-frontend/public/js/backend-integration-fixed.js /home/ubuntu/user-frontend/public/js/backend-integration.js
cp /home/ubuntu/user-frontend/public/js/component-integration-fixed.js /home/ubuntu/user-frontend/public/js/component-integration.js

# Replace index.html
echo "Replacing index.html..."
cp /home/ubuntu/user-frontend/public/index-updated.html /home/ubuntu/user-frontend/public/index.html

echo "Deployment completed successfully!"
echo "You can now access the admin portal at your domain."
echo "Use the following credentials to log in:"
echo "Email: fsanus20111@gmail.com"
echo "Password: your_password"
