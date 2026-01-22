#!/bin/bash
# Script to run the ggkarthik repo analysis and start the React dashboard

echo "Starting analysis of ggkarthik/microservices-demo-app repository..."

# Make this script executable
chmod +x analyze_ggkarthik_repo.py

# Run the analysis script
python3 analyze_ggkarthik_repo.py

# Check if analysis was successful
if [ $? -ne 0 ]; then
  echo "Analysis failed. Please check the logs for errors."
  exit 1
fi

echo "Analysis complete. Starting React dashboard..."

# Navigate to the React dashboard directory
cd "$(dirname "$0")/react-dashboard"

# Kill any existing React development server
echo "Stopping any existing React server..."
pkill -f "node.*react-scripts start" || true

# Start the development server on port 3003
echo "Starting development server on port 3003..."
PORT=3003 npm start
