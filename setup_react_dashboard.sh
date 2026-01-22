#!/bin/bash
# Script to set up the React dashboard with sample data

echo "Setting up React dashboard with sample data..."

# Generate sample data
echo "Generating sample data..."
python3 generate_sample_data.py

# Navigate to the React dashboard directory
cd "$(dirname "$0")/react-dashboard"

# Create a simple README file for the React dashboard
cat > README.md << 'EOF'
# Microservices Demo Dashboard

This is a React-based dashboard for the GoogleCloudPlatform/microservices-demo repository.

## Features

- Interactive microservices inventory visualization
- Repository activity analysis with hierarchical tree view
- Pull requests, commits, and file changes exploration
- Dependency and API visualization

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Build for production:
   ```
   npm run build
   ```
EOF

echo "Setup complete!"
echo "To run the React dashboard, execute: ./run_react_dashboard.sh"
