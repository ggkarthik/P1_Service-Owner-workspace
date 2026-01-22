#!/bin/bash
# Script to run the ggkarthik repo analysis with security data and start the React dashboard

echo "Starting analysis of ggkarthik/microservices-demo-app repository with security data..."

# Make scripts executable
chmod +x analyze_ggkarthik_repo.py
chmod +x add_security_data.py
chmod +x generate_opensource_security_data.py
chmod +x generate_base_images_data.py
chmod +x generate_technologies_data.py
chmod +x generate_dependencies_data.py

# Run the analysis script
echo "Running repository analysis..."
python3 analyze_ggkarthik_repo.py

# Check if analysis was successful
if [ $? -ne 0 ]; then
  echo "Analysis failed. Please check the logs for errors."
  exit 1
fi

# Generate security data
echo "Generating security findings data..."
python3 add_security_data.py

# Check if security data generation was successful
if [ $? -ne 0 ]; then
  echo "Security data generation failed. Please check the logs for errors."
  exit 1
fi

# Generate open source security data
echo "Generating open source security data..."
python3 generate_opensource_security_data.py

# Check if open source security data generation was successful
if [ $? -ne 0 ]; then
  echo "Open source security data generation failed. Please check the logs for errors."
  exit 1
fi

# Generate base images data
echo "Generating base images data..."
python3 generate_base_images_data.py

# Check if base images data generation was successful
if [ $? -ne 0 ]; then
  echo "Base images data generation failed. Please check the logs for errors."
  exit 1
fi

# Generate technologies data
echo "Generating technologies data..."
python3 generate_technologies_data.py

# Check if technologies data generation was successful
if [ $? -ne 0 ]; then
  echo "Technologies data generation failed. Please check the logs for errors."
  exit 1
fi

# Generate dependencies data
echo "Generating dependencies data..."
python3 generate_dependencies_data.py

# Check if dependencies data generation was successful
if [ $? -ne 0 ]; then
  echo "Dependencies data generation failed. Please check the logs for errors."
  exit 1
fi

echo "Analysis complete. Starting React dashboard..."

# Kill any existing React development server
echo "Stopping any existing React server..."
pkill -f "node.*react-scripts start" || true

# Navigate to the React dashboard directory
cd "$(dirname "$0")/react-dashboard"

# Start the development server on port 3010
echo "Starting development server on port 3010..."
PORT=3010 npm start
