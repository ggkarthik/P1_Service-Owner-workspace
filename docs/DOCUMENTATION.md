# Service Owner Workspace - Complete Documentation

This document consolidates all the documentation for the Service Owner Workspace project.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Project Structure](#project-structure)
4. [Scripts Documentation](#scripts-documentation)
5. [Dashboard Features](#dashboard-features)
6. [Deployment Options](#deployment-options)
7. [Development Guide](#development-guide)
8. [API Reference](#api-reference)

## Project Overview

The Service Owner Workspace is a comprehensive dashboard for managing and monitoring microservices architecture. It provides:

- **Microservices Inventory**: Complete catalog of all services
- **Security Scanning**: SAST, SCA, container vulnerabilities, secret detection
- **Dependency Analysis**: Track and manage dependencies across services
- **Technology Stack Visualization**: See all languages, frameworks, and tools
- **Container Management**: Monitor Docker images and base images
- **Repository Activity**: Track PRs, commits, and code changes
- **Service Ownership**: Assign and track service owners

## Quick Start

### Run the Dashboard Locally

```bash
# Navigate to the react dashboard
cd react-dashboard

# Install dependencies
npm install

# Start development server
npm start
```

The dashboard will open at `http://localhost:3000`

### Using Shell Scripts

```bash
# Run the complete dashboard
./scripts/utilities/run_react_dashboard.sh

# Run with fresh data generation
./scripts/utilities/run_updated_dashboard.sh

# Run service owner workspace
./scripts/utilities/run_service_owner_workspace.sh
```

## Project Structure

```
Identity-online-repo/
├── react-dashboard/          # React application
│   ├── public/              # Static files and data
│   ├── src/                 # React components
│   │   ├── components/      # UI components
│   │   ├── pages/          # Page components
│   │   └── styles/         # CSS styles
│   ├── Dockerfile          # Docker configuration
│   └── package.json        # Dependencies
│
├── scripts/                 # All scripts organized by function
│   ├── data-generation/    # Data generation scripts
│   │   ├── generate_service_inventory.py
│   │   ├── generate_security_data.py
│   │   ├── generate_dependencies_data.py
│   │   ├── generate_technologies_data.py
│   │   ├── generate_base_images_data.py
│   │   ├── generate_service_owner_data.py
│   │   ├── generate_package_data.py
│   │   ├── generate_opensource_security_data.py
│   │   ├── generate_sample_data.py
│   │   └── add_security_data.py
│   │
│   ├── analysis/           # Analysis scripts
│   │   ├── analyze_repository.py
│   │   ├── fetch_latest_prs.py
│   │   ├── fetch_repo_activity.py
│   │   └── config.py
│   │
│   └── utilities/          # Utility shell scripts
│       ├── run_react_dashboard.sh
│       ├── run_updated_dashboard.sh
│       ├── run_service_owner_workspace.sh
│       ├── setup_react_dashboard.sh
│       ├── consolidate_data.sh
│       └── cleanup_html_dashboard.sh
│
├── data/                    # Data files
│   ├── generated/          # Generated JSON data
│   ├── schemas/            # Data schemas
│   └── README.md           # Data documentation
│
├── output/                  # Analysis output
├── docs/                    # Documentation
│   ├── archive/            # Archived documentation
│   └── DOCUMENTATION.md    # This file
│
├── README.md               # Project README
├── DEPLOYMENT_GUIDE.md     # Deployment instructions
├── LICENSE                 # MIT License
└── .gitignore             # Git ignore rules
```

## Scripts Documentation

### Data Generation Scripts

Located in `scripts/data-generation/`:

#### 1. **generate_service_inventory.py**
Analyzes microservices and extracts detailed information about each service.

```bash
python3 scripts/data-generation/generate_service_inventory.py
```

**Generates**: `data/generated/service_inventory.json`

#### 2. **generate_security_data.py**
Generates security findings including SAST, SCA, and vulnerability data.

```bash
python3 scripts/data-generation/generate_security_data.py
```

**Generates**: `data/generated/security_findings.json`

#### 3. **generate_dependencies_data.py**
Analyzes and generates dependency information across all services.

```bash
python3 scripts/data-generation/generate_dependencies_data.py
```

**Generates**: `data/generated/dependencies_data.json`

#### 4. **generate_technologies_data.py**
Detects and catalogs technologies, languages, and frameworks used.

```bash
python3 scripts/data-generation/generate_technologies_data.py
```

**Generates**: `data/generated/technologies_data.json`

#### 5. **generate_base_images_data.py**
Analyzes Docker base images and their configurations.

```bash
python3 scripts/data-generation/generate_base_images_data.py
```

**Generates**: `data/generated/base_images_data.json`

#### 6. **generate_service_owner_data.py**
Generates service ownership and team structure data.

```bash
python3 scripts/data-generation/generate_service_owner_data.py
```

**Generates**: `data/generated/service_owner_data.json`

#### 7. **generate_sample_data.py**
Generates sample data for testing the dashboard.

```bash
python3 scripts/data-generation/generate_sample_data.py
```

**Generates**: Multiple JSON files with sample data

### Analysis Scripts

Located in `scripts/analysis/`:

#### **analyze_repository.py**
Main repository analysis script that coordinates data collection.

#### **fetch_latest_prs.py**
Fetches pull request information from GitHub.

#### **fetch_repo_activity.py**
Fetches repository activity data including commits and PRs.

### Utility Scripts

Located in `scripts/utilities/`:

#### **run_react_dashboard.sh**
Starts the React dashboard in development mode.

#### **run_updated_dashboard.sh**
Generates fresh data and starts the dashboard.

#### **setup_react_dashboard.sh**
Sets up the React dashboard (installs dependencies).

## Dashboard Features

### 1. Main Dashboard
- Overview of all microservices
- Key metrics and statistics
- Quick navigation to all sections

### 2. Code Inventory
- Complete service catalog
- Language distribution
- Code metrics per service

### 3. Security Dashboard
- **Security Findings**: SAST, SCA, secrets
- **Open Source Security**: CVE tracking
- **Base Image Management**: Container security

### 4. Technologies
- Programming languages with usage stats
- Frameworks and libraries
- Development tools

### 5. Dependencies
- Complete dependency list
- License compliance tracking
- Vulnerability status
- Outdated package detection

### 6. APIs
- API endpoint catalog
- Service communication patterns
- Request/response documentation

### 7. Infrastructure
- Deployment configurations
- Resource requirements
- Scaling policies
- Kubernetes manifests

### 8. Repository Activity
- Pull requests timeline
- Commit history
- File changes tracking
- Contributor statistics

### 9. Container Images
- Image inventory
- Package analysis
- Size optimization opportunities
- Security scan results

### 10. Service Owner Workspace
- Service ownership assignments
- Contact information
- Team structure
- Responsibility matrix

## Deployment Options

See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Options:

1. **Local Development**: `npm start` in react-dashboard/
2. **Docker**: `docker-compose up` in react-dashboard/
3. **Netlify**: Deploy from GitHub (free)
4. **Vercel**: One-click deployment
5. **GitHub Pages**: Static hosting
6. **Kubernetes**: Production deployment

## Development Guide

### Prerequisites
- Node.js 14+
- Python 3.7+
- npm or yarn

### Setting Up Development Environment

```bash
# Clone the repository
git clone https://github.com/ggkarthik/Service-Owner-workspace.git
cd Service-Owner-workspace

# Install React dependencies
cd react-dashboard
npm install

# Start development server
npm start
```

### Making Changes

1. **React Components**: Edit files in `react-dashboard/src/components/`
2. **Styles**: Edit CSS files in `react-dashboard/src/`
3. **Data Generation**: Modify scripts in `scripts/data-generation/`
4. **Analysis Logic**: Update scripts in `scripts/analysis/`

### Building for Production

```bash
cd react-dashboard
npm run build
```

The optimized build will be in `react-dashboard/build/`

### Running Tests

```bash
cd react-dashboard
npm test
```

## API Reference

### Data File Formats

All data files are JSON format and located in `data/generated/`:

#### service_inventory.json
```json
{
  "summary": {
    "total_services": 12,
    "languages": {...},
    "generated_at": "ISO-8601 timestamp"
  },
  "services": [...]
}
```

#### security_findings.json
```json
{
  "summary": {
    "total_findings": 150,
    "critical": 5,
    "high": 20,
    "medium": 75,
    "low": 50
  },
  "findings": [...]
}
```

#### dependencies_data.json
```json
{
  "total_count": 120,
  "by_language": {...},
  "dependencies": [...]
}
```

### React Component API

#### Main Components

- **App.js**: Main application component
- **Header.js**: Dashboard header with refresh
- **MicroservicesTab.js**: Microservices list view
- **SecurityTab.js**: Security findings display
- **DependenciesTab.js**: Dependency management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions:
1. Check this documentation
2. Review archived docs in `docs/archive/`
3. Check GitHub issues
4. Create a new issue with details

## License

MIT License - see [LICENSE](../LICENSE) for details

---

**Last Updated**: January 2026
**Version**: 1.0.0
