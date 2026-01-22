#!/bin/bash
# Script to fetch repository activity and generate the dashboard

echo "Starting repository activity analysis..."

# Fetch repository activity data
echo "Fetching repository activity data..."
python3 fetch_repo_activity.py

# Generate the dashboard
echo "Generating repository activity dashboard..."
python3 generate_activity_dashboard.py

echo "Repository activity analysis complete!"
echo "Dashboard available at: $(pwd)/output/repo_activity_dashboard.html"
