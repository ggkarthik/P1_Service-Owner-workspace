#!/bin/bash
# Script to run the updated React dashboard with the latest data

echo "Setting up and running the updated React dashboard..."

# Generate fresh sample data
echo "Generating fresh sample data..."
python3 generate_sample_data.py

# Navigate to the React dashboard directory
cd "$(dirname "$0")/react-dashboard"

# Kill any existing React development server
echo "Stopping any existing React server..."
pkill -f "node.*react-scripts start" || true

# Start the development server on a different port
echo "Starting development server on port 3001..."
PORT=3001 npm start
