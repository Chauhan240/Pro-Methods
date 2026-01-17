#!/bin/bash

# Firewall Setup Script for Digital Ocean (Ubuntu)
# Run this script to investigate and fix firewall issues

echo "--- Checking UFW Status ---"
sudo ufw status

echo "--- Allowing Essential Ports ---"
# Allow SSH (Port 22) - CRITICAL, don't lock yourself out
sudo ufw allow 22/tcp

# Allow HTTP (Port 80) - Nginx
sudo ufw allow 80/tcp

# Allow HTTPS (Port 443) - Nginx
sudo ufw allow 443/tcp

# OPTIONAL: Allow Direct Backend access for debugging (Port 8000)
# WARNING: Exposing backend directly is less secure but useful for debugging
sudo ufw allow 8000/tcp

echo "--- Enabling UFW ---"
# 'yes |' to auto confirm if it asks for confirmation
yes | sudo ufw enable

echo "--- UFW Status After Update ---"
sudo ufw status

echo "--- Firewall Setup Complete ---"
echo "You should now be able to access: http://YOUR_IP:8000"
