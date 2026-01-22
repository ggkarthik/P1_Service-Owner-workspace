#!/bin/bash
# Script to persist all dashboard data locally in the Identity-online-repo project

echo "Persisting React dashboard data locally..."

# Create a data directory if it doesn't exist
mkdir -p data

# Copy current data from output directory
echo "Copying data from output directory..."
cp output/*.json data/

# Copy data from React dashboard
echo "Copying data from React dashboard..."
cp react-dashboard/src/data/*.json data/

# Generate fresh sample data and save it
echo "Generating fresh sample data..."
python3 generate_sample_data.py

# Copy the freshly generated data
echo "Copying freshly generated data..."
cp react-dashboard/src/data/*.json data/

# Create a backup of the sample data generation script
echo "Creating backup of data generation script..."
cp generate_sample_data.py data/

echo "Data persistence complete!"
echo "All dashboard data is now stored in the 'data' directory."
echo "The following files have been saved:"
ls -la data/
