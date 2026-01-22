#!/bin/bash
# Script to run the Google microservices-demo repo analysis and start the React dashboard

echo "Starting analysis of GoogleCloudPlatform/microservices-demo repository..."

# Make this script executable
chmod +x analyze_google_repo.py

# Run the analysis script
python3 analyze_google_repo.py

# Check if analysis was successful
if [ $? -ne 0 ]; then
  echo "Analysis failed. Please check the logs for errors."
  exit 1
fi

echo "Analysis complete. Starting React dashboard..."

# Kill any existing React development server
echo "Stopping any existing React server..."
pkill -f "node.*react-scripts start" || true

# Navigate to the React dashboard directory
cd "$(dirname "$0")/react-dashboard"

# Start the development server on port 3000
echo "Starting development server on port 3000..."
npm start
