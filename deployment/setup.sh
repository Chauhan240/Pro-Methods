#!/bin/bash

# Pro Methods Deployment Script for Digital Ocean (Ubuntu)
# Run this script on your server as root or with sudo

set -e

# Configuration
APP_DIR="/var/www/pro_methods"
REPO_URL="" # User should fill this or we assume files are present
BACKEND_PORT=8000
FRONTEND_PORT=3000

echo "--- Starting Deployment Setup ---"

# 1. System Updates
echo "--- Updating System ---"
sudo apt-get update
sudo apt-get upgrade -y

# 2. Install Essentials
echo "--- Installing Essential Packages ---"
sudo apt-get install -y git python3-pip python3-venv nginx curl build-essential

# 3. Install Node.js (LTS)
echo "--- Installing Node.js ---"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install PM2
echo "--- Installing PM2 ---"
sudo npm install -g pm2

# 5. Project Setup assumes you will copy files to /var/www/pro_methods
# If running for the first time on a fresh pull:
# You might want to copy the current directory to $APP_DIR if running purely from upload
# For this script we assume running FROM the project root on server
# e.g. /root/project_folder/deployment/setup.sh

# We'll determine the project root relative to this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "--- Project Code located at $PROJECT_ROOT ---"

# 6. Backend Setup
echo "--- Setting up Backend ---"
cd "$PROJECT_ROOT/backend"

# Create .env if not exists (User must populate this manually for security usually, but we'll touch it)
if [ ! -f .env ]; then
    echo "Creating dummy .env file. Please edit 'backend/.env' with real secrets!"
    touch .env
fi

# Python Venv
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
deactivate

# PM2 for Backend
# Check if already running to delete/restart
sudo pm2 delete pro-backend 2>/dev/null || true
# Start with PM2 (using full path to venv python)
sudo pm2 start "$PROJECT_ROOT/backend/venv/bin/uvicorn" --name "pro-backend" -- main:app --host 0.0.0.0 --port $BACKEND_PORT

# 7. Frontend Setup
echo "--- Setting up Frontend ---"
cd "$PROJECT_ROOT/frontend"

# Install Deps
npm install

# Build
echo "Building Next.js app..."
npm run build

# PM2 for Frontend
sudo pm2 delete pro-frontend 2>/dev/null || true
sudo pm2 start npm --name "pro-frontend" -- start -- -p $FRONTEND_PORT

# 8. Save PM2 lists
sudo pm2 save
sudo pm2 startup | tail -n 1 | bash || true

# 9. Nginx Setup
echo "--- Configuring Nginx ---"
# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Copy config
# We assume nginx.conf is in the same folder as this script
sudo cp "$SCRIPT_DIR/nginx.conf" /etc/nginx/sites-available/pro_methods

# Link config
sudo ln -sf /etc/nginx/sites-available/pro_methods /etc/nginx/sites-enabled/

# Test and Restart Nginx
sudo nginx -t
sudo systemctl restart nginx

echo "--- Deployment Complete! ---"
echo "Public IP: $(curl -s ifconfig.me)"
echo "Backend running on port $BACKEND_PORT (internal)"
echo "Frontend running on port $FRONTEND_PORT (internal)"
echo "Nginx proxying 80 -> Frontend and /api -> Backend"
