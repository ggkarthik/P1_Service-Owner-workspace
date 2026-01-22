#!/bin/bash
# Script to fetch repository activity data and generate the report

echo "Starting repository activity analysis..."

# Run the Python script to fetch repository activity
python3 fetch_latest_prs.py

echo "Repository activity analysis complete!"
echo "Report available at: $(pwd)/output/repo_activity_report.html"
