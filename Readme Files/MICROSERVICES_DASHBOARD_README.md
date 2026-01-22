# Microservices Demo React Dashboard

This project analyzes the [GoogleCloudPlatform/microservices-demo](https://github.com/GoogleCloudPlatform/microservices-demo) repository and generates a React-based dashboard displaying relevant information about the microservices architecture and repository activity.

## Overview

The GoogleCloudPlatform/microservices-demo repository contains a sample cloud-native application with multiple microservices showcasing Kubernetes, Istio, and gRPC. This dashboard provides a visual representation of:

- Microservices inventory and their relationships
- Technology stack and language distribution
- Dependencies across services with detailed analysis
- API endpoints
- Infrastructure components (pipelines, artifacts)
- Repository activity with pull requests, commits, and file changes
- Technology detection with confidence levels

## React Dashboard

The dashboard is built using React and Bootstrap, providing a modern, responsive, and interactive interface to explore the microservices architecture and repository activity.

### Dashboard Features

1. **Overview Metrics**: Quick summary of key metrics including:
   - Number of microservices
   - Programming languages used
   - Dependencies
   - APIs
   - Artifacts
   - Pipelines

2. **Microservices Tab**: Detailed information about each microservice including:
   - Service name
   - Programming language
   - Description
   - Path in the repository

3. **Dependencies Tab**: Enhanced analysis of dependencies with:
   - Interactive filtering and searching
   - Multiple views (overview, list, licenses, security)
   - Dependency status (up-to-date, outdated, vulnerable)
   - License compliance information
   - Security vulnerability assessment

4. **Technologies Tab**: Comprehensive technology detection with:
   - Programming languages with distribution charts
   - Frameworks and libraries with confidence levels
   - Databases and cloud platforms
   - Development tools with categorization

5. **APIs Tab**: List of API endpoints with:
   - Path
   - Method
   - Description

6. **Infrastructure Tab**: Information about:
   - CI/CD Pipelines
   - Artifacts (Docker images, etc.)
   
7. **Repository Activity**: Interactive tree structure of:
   - Pull requests
   - Commits
   - Changed files with additions and deletions

## How to Use

### Running the React Dashboard

To run the React dashboard:

```bash
./run_react_dashboard.sh
```

This will:
1. Navigate to the React dashboard directory
2. Install dependencies
3. Start the development server on port 3000

### Running with Fresh Data

To run the dashboard with freshly generated sample data:

```bash
./run_updated_dashboard.sh
```

This will:
1. Generate fresh sample data
2. Navigate to the React dashboard directory
3. Start the development server on port 3001

### Data Files

The raw data is saved as JSON files:
- `/Users/gowrikarthik.gadela/Desktop/Cascade_Project1/Identity-online-repo/output/microservices_inventory.json`
- `/Users/gowrikarthik.gadela/Desktop/Cascade_Project1/Identity-online-repo/output/repo_activity_summary.json`

These files can be used for further analysis or integration with other tools.

## Implementation Details

The dashboard is implemented using:

1. **React**: Modern JavaScript library for building user interfaces
2. **Bootstrap**: CSS framework for responsive design
3. **Data Collection**: Python scripts collect information about the microservices and repository activity
4. **Data Processing**: The collected data is processed to extract relationships and metrics
5. **Visualization**: The processed data is visualized using React components, charts, and interactive elements

## Future Enhancements

Potential enhancements for the dashboard include:

1. **Live Data**: Connect to the actual repository API to get real-time data
2. **Dependency Graph**: Enhanced visual representation of dependencies between services
3. **Service Mesh Visualization**: Visual representation of the service mesh architecture
4. **Performance Metrics**: Integration with monitoring tools to display performance metrics
5. **Security Analysis**: Deeper integration with security scanning tools to display vulnerabilities
6. **User Authentication**: Add user authentication for accessing sensitive information
7. **Custom Themes**: Allow users to customize the dashboard appearance

## License

This project is licensed under the same license as the Identity project.
