#!/bin/bash
# Script to build and run the React dashboard

echo "Setting up React dashboard..."

# Navigate to the React dashboard directory
cd "$(dirname "$0")/react-dashboard"

# Install dependencies
echo "Installing dependencies..."
npm install

# Start the development server
echo "Starting development server..."
npm start
