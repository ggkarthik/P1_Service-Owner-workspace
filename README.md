# Service Owner Workspace

A comprehensive dashboard for managing and monitoring microservices architecture, providing insights into service inventory, security, dependencies, and repository activity.

## 🚀 Overview

This project provides a **Service Owner Workspace** - a React-based dashboard designed to give service owners complete visibility and control over their microservices ecosystem. It analyzes the microservices architecture, extracts detailed information about each service, and presents it in an interactive, user-friendly interface.

### Key Features

- **📊 Microservices Inventory**: Complete overview of all microservices with language, dependencies, and configuration details
- **🔒 Security Dashboard**: Comprehensive security scanning including SAST, SCA, container vulnerabilities, and secret detection
- **📦 Dependency Management**: Track and analyze all dependencies across services with license compliance
- **🔧 Technology Stack Analysis**: Visual representation of technologies, frameworks, and tools used
- **🐳 Container & Image Management**: Monitor Docker images, base images, and container security
- **📈 Repository Activity**: Track pull requests, commits, and code changes with interactive tree views
- **👥 Service Owner Management**: Assign and track service ownership across the organization
- **🌐 API Documentation**: Comprehensive API endpoint tracking and documentation

## 🏗️ Project Structure

```
Identity-online-repo/
├── react-dashboard/          # React frontend application
│   ├── public/              # Static assets and data
│   ├── src/                 # React components and pages
│   ├── Dockerfile           # Docker configuration for deployment
│   ├── docker-compose.yml   # Docker Compose configuration
│   └── package.json         # NPM dependencies
│
├── scripts/                 # All scripts organized by function
│   ├── data-generation/    # Data generation scripts
│   ├── analysis/           # Repository analysis scripts
│   └── utilities/          # Shell utility scripts
│
├── data/                    # Data storage
│   ├── generated/          # Generated JSON data files
│   └── schemas/            # Data schemas
│
├── docs/                    # Documentation
│   ├── DOCUMENTATION.md    # Complete project documentation
│   └── archive/            # Archived documentation
│
├── output/                  # Analysis output files
├── README.md               # This file
├── DEPLOYMENT_GUIDE.md     # Detailed deployment instructions
├── LICENSE                 # MIT License
└── .gitignore             # Git ignore rules
```

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0**: Modern UI library
- **React Bootstrap 2.7.4**: UI components
- **Chart.js 4.3.0**: Data visualization
- **React Router 6.30.2**: Navigation
- **React Icons 4.12.0**: Icon library

### Backend & Analysis
- **Python 3.x**: Data analysis and processing
- **Node.js**: Runtime for React application

### Deployment
- **Docker**: Containerization
- **Nginx**: Web server
- **Docker Compose**: Multi-container orchestration

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **Python** (v3.7 or higher)
- **Docker** (optional, for containerized deployment)
- **npm** or **yarn**

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd Identity-online-repo
```

2. **Install React dependencies**
```bash
cd react-dashboard
npm install
```

3. **Start the development server**
```bash
npm start
```

The dashboard will be available at `http://localhost:3000`

### Using Shell Scripts

```bash
# Setup the dashboard (first time only)
./scripts/utilities/setup_react_dashboard.sh

# Run the dashboard
./scripts/utilities/run_react_dashboard.sh

# Run with fresh data generation
./scripts/utilities/run_updated_dashboard.sh

# Run service owner workspace
./scripts/utilities/run_service_owner_workspace.sh
```

## 🐳 Docker Deployment

### Using Docker

```bash
cd react-dashboard
docker build -t service-owner-workspace .
docker run -p 80:80 service-owner-workspace
```

### Using Docker Compose

```bash
cd react-dashboard
docker-compose up -d
```

The dashboard will be available at `http://localhost`

## 📊 Data Generation

The dashboard uses various Python scripts to analyze and generate data:

### Generate All Data
```bash
python3 scripts/data-generation/generate_service_inventory.py
python3 scripts/data-generation/generate_security_data.py
python3 scripts/data-generation/generate_dependencies_data.py
python3 scripts/data-generation/generate_technologies_data.py
python3 scripts/data-generation/generate_base_images_data.py
python3 scripts/data-generation/generate_service_owner_data.py
python3 scripts/analysis/fetch_repo_activity.py
```

### Quick Data Generation
```bash
# Generate sample data for testing
python3 scripts/data-generation/generate_sample_data.py
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `react-dashboard` directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GITHUB_TOKEN=your_github_token_here

# Feature Flags
REACT_APP_ENABLE_SECURITY=true
REACT_APP_ENABLE_ANALYTICS=true
```

### Data Sources

The dashboard reads data from JSON files in the `data/generated/` directory:
- `service_inventory.json`: Microservices inventory
- `security_findings.json`: Security scan results
- `dependencies_data.json`: Dependency information
- `technologies_data.json`: Technology stack data
- `image_inventory.json`: Container image data
- `base_images_data.json`: Base image analysis
- `repo_activity_summary.json`: Repository activity
- `service_owner_data.json`: Service ownership

## 📖 Dashboard Sections

### 1. Main Dashboard
- Overview of all microservices
- Key metrics and statistics
- Quick access to all sections

### 2. Code Inventory
- Service catalog
- Language distribution
- Code metrics

### 3. Security
- **Security Findings**: SAST, SCA, secrets scanning
- **Open Source Security**: Vulnerability assessment
- **Base Image Management**: Container security

### 4. Technologies
- Programming languages
- Frameworks and libraries
- Development tools

### 5. Dependencies
- Dependency list and versions
- License compliance
- Outdated and vulnerable packages

### 6. APIs
- API endpoint catalog
- Service communication patterns
- API documentation

### 7. Infrastructure
- Deployment configurations
- Resource requirements
- Scaling policies

### 8. Repository Activity
- Pull requests
- Commits
- File changes

### 9. Container Images
- Image inventory
- Package analysis
- Base image tracking

### 10. Service Owner Workspace
- Service ownership assignments
- Contact information
- Team structure

## 🔒 Security Features

- **Static Application Security Testing (SAST)**: Code analysis with CodeQL
- **Software Composition Analysis (SCA)**: Dependency vulnerability scanning with Dependabot
- **Secret Scanning**: Detection of exposed secrets with TruffleHog
- **Container Scanning**: Image vulnerability scanning with Trivy
- **SBOM Generation**: Software Bill of Materials creation
- **License Compliance**: Track open source licenses

## 🧪 Testing

```bash
cd react-dashboard
npm test
```

## 📦 Building for Production

```bash
cd react-dashboard
npm run build
```

The optimized production build will be in the `build/` directory.

## 🚀 Deployment Options

### 1. Static Hosting
Deploy the `build/` folder to:
- **Netlify**: Automatic deployment from Git
- **Vercel**: Zero-config deployment
- **GitHub Pages**: Free hosting for public repos
- **AWS S3 + CloudFront**: Scalable cloud hosting
- **Azure Static Web Apps**: Enterprise-grade hosting

### 2. Container Deployment
- **Kubernetes**: Use the provided Docker image
- **AWS ECS/EKS**: Container orchestration
- **Google Cloud Run**: Serverless containers
- **Azure Container Apps**: Managed containers

### 3. Traditional Hosting
- **Apache/Nginx**: Standard web server deployment
- **IIS**: Windows server deployment

## 📝 Documentation

For complete documentation, see:
- **[docs/DOCUMENTATION.md](docs/DOCUMENTATION.md)**: Comprehensive project documentation
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**: Detailed deployment instructions
- **[react-dashboard/DEPLOYMENT.md](react-dashboard/DEPLOYMENT.md)**: React-specific deployment
- **[docs/archive/](docs/archive/)**: Archived documentation and guides

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for analyzing the [GoogleCloudPlatform/microservices-demo](https://github.com/GoogleCloudPlatform/microservices-demo) repository
- Inspired by modern DevOps and SRE practices
- Uses industry-standard security scanning tools

## 📞 Support

For questions, issues, or feature requests, please:
1. Check the documentation in `Readme Files/`
2. Search existing issues
3. Create a new issue with detailed information

## 🔄 Version History

- **v1.0.0**: Initial release with core dashboard features
- Enhanced security scanning capabilities
- Service owner workspace integration
- Comprehensive dependency analysis

---

**Made with ❤️ for Service Owners and DevOps Teams**
