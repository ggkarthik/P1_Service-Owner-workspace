# Online Boutique Microservices Analysis

This project analyzes the [GoogleCloudPlatform/microservices-demo](https://github.com/GoogleCloudPlatform/microservices-demo) repository (also known as Online Boutique) and generates interactive dashboards displaying:

1. **Microservices Inventory**: Information about the microservices architecture, dependencies, and infrastructure
2. **Repository Activity**: Pull requests, commits, contributors, and file changes

## React Dashboard

A modern React-based dashboard is available that combines both the microservices inventory and repository activity data in a single interactive interface. The repository activity is displayed in an interactive tree structure that allows you to explore pull requests, commits, and file changes in a hierarchical manner.

## Project Structure

```
Identity-online-repo/
├── analyze_microservices_demo.py       # Script to analyze the repo using direct API calls
├── analyze_microservices_demo_mcp.py   # Script to analyze the repo using GitHub MCP
├── fetch_latest_prs.py                 # Script to fetch repository activity data
├── generate_activity_dashboard.py      # Script to generate the repository activity dashboard
├── generate_dashboard.py               # Script to generate the microservices inventory dashboard
├── MICROSERVICES_DASHBOARD_README.md   # Detailed documentation about the dashboard
├── README.md                           # This file
├── run_activity_analysis.sh            # Script to run the repository activity analysis
├── run_dashboard.sh                    # Script to run the microservices inventory dashboard generation
├── run_react_dashboard.sh              # Script to run the React dashboard
├── output/                             # Generated output files
│   ├── microservices_dashboard.html    # The interactive microservices inventory dashboard
│   ├── microservices_inventory.json    # Raw inventory data in JSON format
│   ├── repo_activity_dashboard.html    # The interactive repository activity dashboard
│   ├── pull_requests.json              # Pull requests data
│   ├── commits.json                    # Commits data
│   ├── repo_statistics.json            # Repository statistics
│   └── repo_activity_summary.json      # Repository activity summary
├── react-dashboard/                    # React dashboard application
│   ├── package.json                    # React project configuration
│   ├── public/                         # Public assets
│   └── src/                            # React source code
│       ├── components/                 # React components
│       └── data/                       # JSON data files
└── src/                                # Source code
    └── templates/                      # HTML templates
        └── microservices_dashboard.html # Dashboard template
```

## Quick Start

### React Dashboard (Recommended)

To run the React dashboard that combines both microservices inventory and repository activity:

```bash
./run_react_dashboard.sh
```

This will:
1. Install the necessary dependencies
2. Start the React development server
3. Open the dashboard in your default web browser

### Microservices Inventory Dashboard

To generate the microservices inventory dashboard:

```bash
./run_dashboard.sh
```

This will:
1. Generate the microservices inventory data
2. Create the HTML dashboard
3. Save the inventory data as JSON
4. Provide the path to open the dashboard

### Repository Activity Dashboard

To fetch repository activity data and generate the dashboard:

```bash
./run_activity_analysis.sh
```

This will:
1. Fetch pull requests, commits, and file changes from the repository
2. Analyze the data to extract statistics
3. Generate an interactive dashboard
4. Save the raw data as JSON files

## Features

### Microservices Inventory Dashboard

- Overview metrics (microservices count, languages, dependencies, etc.)
- Detailed information about each microservice
- Dependencies across services
- API endpoints
- Infrastructure components (pipelines, artifacts)

### Repository Activity Dashboard

- **Total counts**: Pull requests and commits in the entire repository
- **Latest 5 pull requests**: Detailed information about the most recent PRs
- **Commits per PR**: All commits associated with each pull request
- **PR owners**: Authors of each pull request
- **Commit authors**: Names and emails of commit authors
- **Changed files**: List of files modified in each PR with additions and deletions

## Available Scripts

- `generate_dashboard.py`: Generate the microservices inventory dashboard
- `analyze_microservices_demo.py`: Analyze the repo using direct API calls
- `analyze_microservices_demo_mcp.py`: Analyze the repo using GitHub MCP
- `fetch_repo_activity.py`: Fetch repository activity data
- `generate_activity_dashboard.py`: Generate the repository activity dashboard
- `run_dashboard.sh`: Run the microservices inventory dashboard generation
- `run_activity_analysis.sh`: Run the repository activity analysis

## More Information

For more detailed information about the microservices inventory dashboard and its features, see [MICROSERVICES_DASHBOARD_README.md](MICROSERVICES_DASHBOARD_README.md).
