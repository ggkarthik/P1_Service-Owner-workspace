# Dashboard Data

This directory contains all the data used to generate the React dashboard for the GoogleCloudPlatform/microservices-demo repository.

## Files

### 1. microservices_inventory.json

This file contains detailed information about the microservices architecture, including:

- Repository metadata
- Technologies used (languages, frameworks, databases, cloud platforms)
- Dependencies with vulnerability and outdated status
- API endpoints
- Infrastructure components (pipelines, artifacts)
- Services information

### 2. repo_activity_summary.json

This file contains information about the repository activity, including:

- Repository metadata
- Summary statistics (total pull requests, total commits)
- Detailed information about the latest pull requests
- Commits associated with each pull request
- Files changed in each pull request

### 3. generate_sample_data.py

This is a backup of the script used to generate the sample data. It can be used to:

- Generate fresh sample data
- Understand the data structure
- Modify the data generation logic if needed

## Usage

The data in this directory is used by the React dashboard to display information about the microservices architecture and repository activity. The data is loaded by the React components when the dashboard is started.

To generate fresh sample data, you can run:

```bash
python3 generate_sample_data.py
```

This will generate new sample data and save it to the React dashboard's data directory.

## Data Structure

### Microservices Inventory

The microservices inventory data includes:

- **Repository**: Basic information about the repository
- **Technologies**: Information about languages, frameworks, databases, and cloud platforms used
- **Dependencies**: List of dependencies with details about versions, vulnerabilities, and outdated status
- **APIs**: List of API endpoints
- **Security**: Information about security issues
- **Infrastructure**: Information about pipelines and artifacts
- **Services**: List of microservices with details

### Repository Activity

The repository activity data includes:

- **Repository**: Basic information about the repository
- **Summary**: Summary statistics about pull requests and commits
- **Pull Requests**: Detailed information about the latest pull requests, including:
  - Pull request metadata (number, title, state, dates)
  - Author information
  - Commits associated with the pull request
  - Files changed in the pull request
