# Identity-online-repo Directory Structure

## Complete File Structure

```
Identity-online-repo/
│
├── react-dashboard/                    # Main React application
│   ├── public/
│   │   ├── index.html                  # HTML entry point
│   │   ├── manifest.json               # PWA manifest
│   │   ├── data                        # Symlink to ../data
│   │   └── _redirects                  # Netlify SPA routing
│   │
│   ├── src/
│   │   ├── pages/                      # ✨ NEW: Page components
│   │   │   ├── LandingPage.js          # Marketing landing page
│   │   │   ├── LandingPage.css         # Landing page styles
│   │   │   ├── LoginPage.js            # Authentication page
│   │   │   ├── LoginPage.css           # Login page styles
│   │   │   └── DashboardPage.js        # Protected dashboard wrapper
│   │   │
│   │   ├── components/                 # Dashboard components
│   │   │   ├── Header.js               # ✨ UPDATED: Added logout
│   │   │   ├── MicroservicesTab.js
│   │   │   ├── SecurityTab.js
│   │   │   ├── TechnologiesTab.js
│   │   │   ├── DependenciesTab.js
│   │   │   ├── APIsTab.js
│   │   │   ├── InfrastructureTab.js
│   │   │   ├── RepositoryActivityTab.js
│   │   │   ├── ImagesTab.js
│   │   │   ├── BaseImagesTab.js
│   │   │   ├── OpenSourceSecurityTab.js
│   │   │   ├── BaseImageManagementTab.js
│   │   │   ├── ServiceOwnerWorkspace.js
│   │   │   ├── CodeInventory.js
│   │   │   ├── ImageInventory.js
│   │   │   ├── NewCodeInventory.js
│   │   │   ├── NewImageInventory.js
│   │   │   ├── ServiceInventory.js
│   │   │   ├── SecurityFindings.js
│   │   │   └── [+ CSS files for each]
│   │   │
│   │   ├── App.js                      # Main dashboard component
│   │   ├── AppRouter.js                # ✨ NEW: React Router setup
│   │   ├── index.js                    # ✨ UPDATED: Uses AppRouter
│   │   ├── index.css                   # Global styles
│   │   └── setupProxy.js               # Proxy configuration
│   │
│   ├── build/                          # Production build output
│   │
│   ├── node_modules/                   # Dependencies
│   │
│   ├── Dockerfile                      # ✨ NEW: Docker configuration
│   ├── docker-compose.yml              # ✨ NEW: Docker Compose setup
│   ├── nginx.conf                      # ✨ NEW: Nginx configuration
│   ├── .dockerignore                   # ✨ NEW: Docker ignore rules
│   ├── .env.example                    # ✨ NEW: Environment template
│   ├── start.sh                        # ✨ NEW: Quick start script
│   │
│   ├── package.json                    # ✨ UPDATED: Added react-router-dom
│   ├── package-lock.json               # Dependency lock file
│   │
│   ├── README.md                       # Original README
│   ├── README_RISKLENS.md              # ✨ NEW: Complete documentation
│   ├── DEPLOYMENT.md                   # ✨ NEW: Deployment guide
│   ├── DEPLOYMENT_CHECKLIST.md         # ✨ NEW: Deployment checklist
│   ├── MARKETING_CONTENT.md            # ✨ NEW: Marketing materials
│   └── PROJECT_SUMMARY.md              # ✨ NEW: Project overview
│
├── data/                               # Dashboard data files
│   ├── microservices_inventory.json    # Service inventory
│   ├── repo_activity_summary.json      # Repository activity
│   ├── security_findings.json          # Security scan results
│   ├── technologies.json               # Technology stack
│   ├── dependencies.json               # Dependencies
│   ├── base_images.json                # Container images
│   ├── opensource_security.json        # Open source security
│   ├── service_owner_data.json         # Service ownership
│   ├── generate_sample_data.py         # Data generation script
│   └── README.md                       # Data documentation
│
├── output/                             # Generated output files
│   └── [various JSON outputs]
│
├── output.backup/                      # Backup of outputs
│
├── Readme Files/                       # Documentation
│
├── archive/                            # Archived files
│
├── src/                                # Source Python scripts
│
├── Python Scripts (root level):
│   ├── generate_sample_data.py         # Sample data generator
│   ├── generate_service_inventory.py   # Service inventory generator
│   ├── generate_security_data.py       # Security data generator
│   ├── generate_opensource_security_data.py
│   ├── generate_base_images_data.py
│   ├── generate_dependencies_data.py
│   ├── generate_technologies_data.py
│   ├── generate_package_data.py
│   ├── generate_service_owner_data.py
│   ├── generate_mock_activity_data.py
│   ├── fetch_latest_prs.py
│   ├── fetch_repo_activity.py
│   ├── analyze_repository.py
│   ├── add_security_data.py
│   ├── update_ggkarthik_dashboard.py
│   └── config.py
│
├── Shell Scripts (root level):
│   ├── run_react_dashboard.sh          # Run React dashboard
│   ├── run_updated_dashboard.sh        # Run with fresh data
│   ├── setup_react_dashboard.sh        # Setup script
│   ├── persist_dashboard_data.sh       # Persist data
│   ├── consolidate_data.sh             # Consolidate data
│   ├── cleanup_html_dashboard.sh       # Cleanup old files
│   ├── run_ggkarthik_dashboard.sh
│   ├── run_ggkarthik_with_security.sh
│   ├── run_google_dashboard.sh
│   ├── run_repo_activity.sh
│   ├── run_activity_analysis.sh
│   ├── run_service_owner_workspace.sh
│   ├── run_updated_ggkarthik_dashboard.sh
│   └── run.sh
│
├── DIRECTORY_STRUCTURE.md              # ✨ NEW: This file
├── package-lock.json                   # Root package lock
└── .DS_Store                           # macOS metadata

```

## ✨ New Files Created for RiskLens Platform

### React Application Files
1. **src/pages/LandingPage.js** - Marketing landing page with CTEM framework
2. **src/pages/LandingPage.css** - Landing page styles
3. **src/pages/LoginPage.js** - Authentication page
4. **src/pages/LoginPage.css** - Login page styles
5. **src/pages/DashboardPage.js** - Protected dashboard wrapper
6. **src/AppRouter.js** - React Router configuration

### Deployment Files
7. **Dockerfile** - Multi-stage Docker build
8. **docker-compose.yml** - Docker Compose configuration
9. **nginx.conf** - Nginx web server configuration
10. **.dockerignore** - Docker build optimization
11. **.env.example** - Environment variables template
12. **public/_redirects** - Netlify SPA routing

### Documentation Files
13. **README_RISKLENS.md** - Complete technical documentation
14. **DEPLOYMENT.md** - Comprehensive deployment guide
15. **DEPLOYMENT_CHECKLIST.md** - Step-by-step deployment checklist
16. **MARKETING_CONTENT.md** - Marketing strategy and content
17. **PROJECT_SUMMARY.md** - Project overview and summary
18. **DIRECTORY_STRUCTURE.md** - This file

### Scripts
19. **start.sh** - Quick start script with helpful output

### Updated Files
20. **src/index.js** - Now uses AppRouter instead of App
21. **src/components/Header.js** - Added logout and user display
22. **package.json** - Added react-router-dom dependency

## File Locations Confirmed ✅

All files are located in:
```
/Users/gowrikarthik.gadela/Desktop/Cascade_Project1/Identity-online-repo/
```

### React Dashboard Location
```
/Users/gowrikarthik.gadela/Desktop/Cascade_Project1/Identity-online-repo/react-dashboard/
```

### Data Files Location
```
/Users/gowrikarthik.gadela/Desktop/Cascade_Project1/Identity-online-repo/data/
```

## Quick Access Commands

### Navigate to Project
```bash
cd /Users/gowrikarthik.gadela/Desktop/Cascade_Project1/Identity-online-repo
```

### Navigate to React Dashboard
```bash
cd /Users/gowrikarthik.gadela/Desktop/Cascade_Project1/Identity-online-repo/react-dashboard
```

### Start Development Server
```bash
cd react-dashboard
./start.sh
# or
npm start
```

### Build for Production
```bash
cd react-dashboard
npm run build
```

### Deploy with Docker
```bash
cd react-dashboard
docker build -t risklens-app .
docker run -p 80:80 risklens-app
```

## File Count Summary

- **New Files Created**: 19
- **Updated Files**: 3
- **Total React Components**: 30+
- **Documentation Files**: 6
- **Deployment Files**: 6
- **Python Scripts**: 20+
- **Shell Scripts**: 15+

## Storage Location

All files are stored locally in:
```
Desktop/Cascade_Project1/Identity-online-repo/
```

No files are stored outside this directory. Everything is self-contained and portable.

## Verification

To verify all files are present, run:
```bash
cd /Users/gowrikarthik.gadela/Desktop/Cascade_Project1/Identity-online-repo/react-dashboard

# Check new pages
ls -la src/pages/

# Check deployment files
ls -la | grep -E "(Dockerfile|docker-compose|nginx.conf|.env.example|start.sh)"

# Check documentation
ls -la | grep -E "\.md$"

# Check public files
ls -la public/
```

## Status: ✅ All Files Confirmed

All files for the RiskLens Enterprise Platform are located in the Identity-online-repo directory and its subdirectories. The project is complete and ready for deployment.
