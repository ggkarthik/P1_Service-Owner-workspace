# Scripts Directory

This directory contains all scripts organized by functionality.

## Directory Structure

```
scripts/
├── data-generation/    # Scripts for generating dashboard data
├── analysis/           # Scripts for analyzing repositories
└── utilities/          # Shell utility scripts
```

## Data Generation Scripts (`data-generation/`)

### Core Generators
- **generate_service_inventory.py**: Analyzes microservices and extracts service details
- **generate_security_data.py**: Generates security findings (SAST, SCA, vulnerabilities)
- **generate_dependencies_data.py**: Analyzes dependencies across all services
- **generate_technologies_data.py**: Detects technologies, languages, and frameworks
- **generate_base_images_data.py**: Analyzes Docker base images
- **generate_service_owner_data.py**: Generates service ownership data
- **generate_package_data.py**: Extracts package information from containers
- **generate_opensource_security_data.py**: Analyzes open source security vulnerabilities

### Utilities
- **generate_sample_data.py**: Generates sample data for testing
- **generate_mock_activity_data.py**: Creates mock repository activity data
- **add_security_data.py**: Adds security data to existing datasets

## Analysis Scripts (`analysis/`)

- **analyze_repository.py**: Main repository analysis coordinator
- **fetch_latest_prs.py**: Fetches pull request information from GitHub
- **fetch_repo_activity.py**: Fetches repository activity (commits, PRs, files)
- **config.py**: Configuration file for analysis scripts

## Utility Scripts (`utilities/`)

### Dashboard Management
- **run_react_dashboard.sh**: Start the React dashboard
- **run_updated_dashboard.sh**: Generate fresh data and start dashboard
- **run_service_owner_workspace.sh**: Run the service owner workspace view
- **setup_react_dashboard.sh**: Setup/install dashboard dependencies

### Data Management
- **consolidate_data.sh**: Consolidate data from multiple sources
- **persist_dashboard_data.sh**: Persist dashboard data locally

### Utilities
- **push_to_github.sh**: Helper script to push changes to GitHub
- **cleanup_html_dashboard.sh**: Clean up old HTML dashboard files
- **run.sh**: General run script
- **run_activity_analysis.sh**: Run repository activity analysis
- **update_ggkarthik_dashboard.py**: Update dashboard with latest data

## Quick Start

### Generate All Data

```bash
# From project root
python3 scripts/data-generation/generate_service_inventory.py
python3 scripts/data-generation/generate_security_data.py
python3 scripts/data-generation/generate_dependencies_data.py
python3 scripts/data-generation/generate_technologies_data.py
python3 scripts/data-generation/generate_base_images_data.py
python3 scripts/data-generation/generate_service_owner_data.py
```

### Generate Sample Data (for testing)

```bash
python3 scripts/data-generation/generate_sample_data.py
```

### Run Dashboard

```bash
# Simple run
./scripts/utilities/run_react_dashboard.sh

# Run with fresh data
./scripts/utilities/run_updated_dashboard.sh
```

## Usage Examples

### Analyze a Repository

```bash
cd scripts/analysis
python3 analyze_repository.py
```

### Fetch Repository Activity

```bash
python3 scripts/analysis/fetch_repo_activity.py
```

### Generate Security Report

```bash
python3 scripts/data-generation/generate_security_data.py
python3 scripts/data-generation/generate_opensource_security_data.py
```

## Requirements

- **Python 3.7+**
- **Node.js 14+** (for dashboard scripts)
- **Dependencies**: See individual script files for specific requirements

## Output

All scripts generate JSON files in the `data/generated/` directory:
- `service_inventory.json`
- `security_findings.json`
- `dependencies_data.json`
- `technologies_data.json`
- `base_images_data.json`
- `service_owner_data.json`
- `package_data.json`
- `opensource_security.json`
- `repo_activity_summary.json`

## Notes

- All Python scripts should be run from the project root directory
- Shell scripts can be run from anywhere
- Generated data is automatically used by the React dashboard
- Scripts with `.sh` extension are executable shell scripts
- Scripts with `.py` extension are Python scripts

## Troubleshooting

### Python Script Errors
```bash
# Ensure you're in the project root
cd /path/to/Identity-online-repo

# Run with full path
python3 scripts/data-generation/generate_service_inventory.py
```

### Shell Script Permission Denied
```bash
# Make scripts executable
chmod +x scripts/utilities/*.sh
```

### Missing Dependencies
```bash
# Install Python dependencies (if any)
pip install -r requirements.txt

# Install Node dependencies
cd react-dashboard && npm install
```

---

For complete documentation, see [../docs/DOCUMENTATION.md](../docs/DOCUMENTATION.md)
