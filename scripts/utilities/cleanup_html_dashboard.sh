#!/bin/bash
# Script to clean up the old HTML dashboard files

echo "Cleaning up old HTML dashboard files..."

# Remove HTML dashboard files
find . -name "microservices_dashboard.html" -type f -delete
find . -name "repo_activity_report.html" -type f -delete

# Remove HTML dashboard generation scripts
rm -f generate_dashboard.py generate_activity_dashboard.py 2>/dev/null

# Remove HTML dashboard run scripts
rm -f run_dashboard.sh 2>/dev/null

# Remove open_dashboard.html
rm -f open_dashboard.html 2>/dev/null

echo "Cleanup complete! The React dashboard is now the primary dashboard."
echo "To run the React dashboard, use: ./run_react_dashboard.sh"
echo "To run with fresh data, use: ./run_updated_dashboard.sh"
