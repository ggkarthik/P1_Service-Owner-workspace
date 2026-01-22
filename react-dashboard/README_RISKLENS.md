# RiskLens - Enterprise Risk Intelligence Platform

![RiskLens Logo](https://img.shields.io/badge/RiskLens-Enterprise%20Risk%20Intelligence-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=flat-square)
![License](https://img.shields.io/badge/license-Enterprise-orange?style=flat-square)

**Transform Security Chaos into Actionable Insights**

RiskLens is an enterprise-grade risk intelligence platform that helps security teams discover, prioritize, and remediate vulnerabilities at scale. Built on the CTEM (Continuous Threat Exposure Management) framework.

---

## 🌟 Features

### 🎯 CTEM Framework
Built on the five phases of Continuous Threat Exposure Management:
- **Scoping**: Comprehensive asset discovery and inventory
- **Discovery**: Multi-scanner vulnerability detection
- **Prioritization**: Risk-based ranking and filtering
- **Validation**: Root cause analysis and impact assessment
- **Mobilization**: Actionable remediation guidance

### 🔐 Security Intelligence
- **Multi-Scanner Integration**: Aggregate findings from SAST, DAST, SCA, and container scanners
- **Root Cause Analysis**: Trace vulnerabilities to their source
- **Risk Prioritization**: View risk through multiple lenses
- **Trend Analysis**: Track security posture over time

### 📊 Enterprise Asset Inventory
- Application portfolio management
- Microservices architecture mapping
- API catalog and documentation
- Technology stack analysis
- Dependency relationship graphs

### 👥 Team Collaboration
- Service owner workspaces
- Distributed security responsibility
- Clear, actionable guidance
- Progress tracking and reporting

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ./start.sh
   # or
   npm start
   ```

4. **Access the application**
   - Landing Page: http://localhost:3000
   - Login: http://localhost:3000/login
   - Dashboard: http://localhost:3000/dashboard

### Demo Credentials
```
Email:    demo@risklens.com
Password: demo123
```

---

## 📁 Project Structure

```
react-dashboard/
├── public/
│   ├── index.html
│   └── _redirects              # Netlify redirects for SPA routing
├── src/
│   ├── pages/
│   │   ├── LandingPage.js      # Marketing landing page
│   │   ├── LandingPage.css
│   │   ├── LoginPage.js        # Authentication page
│   │   ├── LoginPage.css
│   │   └── DashboardPage.js    # Protected dashboard wrapper
│   ├── components/
│   │   ├── Header.js           # Dashboard header with logout
│   │   ├── MicroservicesTab.js # Microservices inventory
│   │   ├── SecurityTab.js      # Security findings
│   │   ├── TechnologiesTab.js  # Technology stack
│   │   ├── DependenciesTab.js  # Dependency analysis
│   │   └── ...                 # Other dashboard components
│   ├── App.js                  # Main dashboard component
│   ├── AppRouter.js            # React Router configuration
│   ├── index.js                # Application entry point
│   └── index.css               # Global styles
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose setup
├── nginx.conf                  # Nginx configuration
├── package.json                # Dependencies
├── DEPLOYMENT.md               # Deployment guide
├── MARKETING_CONTENT.md        # Marketing materials
└── README_RISKLENS.md          # This file
```

---

## 🎨 User Interface

### Landing Page
- Hero section with value proposition
- CTEM framework explanation
- Feature highlights
- Use cases by persona
- Call-to-action buttons

### Login Page
- Modern, secure authentication
- Demo credentials for testing
- Responsive design
- Branding and statistics

### Dashboard
- Multi-tab interface
- Real-time data visualization
- Interactive charts and graphs
- Service owner workspaces
- Security findings and remediation

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file (see `.env.example`):

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
REACT_APP_JWT_SECRET=your-secret-key
```

### Data Sources

The dashboard loads data from:
- `../data/microservices_inventory.json` - Asset inventory
- `../data/repo_activity_summary.json` - Repository activity
- `../data/security_findings.json` - Security scan results

Generate sample data:
```bash
cd ..
python generate_sample_data.py
```

---

## 🚢 Deployment

### Quick Deploy with Docker

```bash
# Build the image
docker build -t risklens-app .

# Run the container
docker run -p 80:80 risklens-app
```

### Deploy with Docker Compose

```bash
docker-compose up -d
```

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=build
```

### Deploy to Vercel

```bash
vercel --prod
```

### Deploy to AWS S3 + CloudFront

```bash
npm run build
aws s3 sync build/ s3://risklens-app --acl public-read
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🔐 Authentication

### Current Implementation
- Demo authentication with localStorage
- JWT token simulation
- Protected routes with React Router

### Production Implementation
For production, replace with:
- OAuth 2.0 / SAML integration
- JWT tokens with backend validation
- Session management
- Multi-factor authentication (MFA)
- Role-based access control (RBAC)

Example backend integration:
```javascript
// Update LoginPage.js
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token } = await response.json();
localStorage.setItem('authToken', token);
```

---

## 📊 Dashboard Components

### Microservices Tab
- Service inventory with health status
- Technology stack breakdown
- Dependency relationships
- API endpoints

### Security Tab
- Vulnerability findings by severity
- CVSS score distribution
- Affected assets
- Remediation recommendations

### Technologies Tab
- Programming languages
- Frameworks and libraries
- Databases and platforms
- Development tools

### Dependencies Tab
- Package inventory
- Outdated dependencies
- License compliance
- Security vulnerabilities

### Base Images Tab
- Container base images
- Vulnerability tracking
- Update recommendations
- Impact analysis

### Service Owner Workspace
- Team-specific views
- Assigned findings
- Remediation progress
- Collaboration tools

---

## 🎯 CTEM Framework Implementation

### Phase 1: Scoping
```javascript
// Asset discovery and inventory
const assets = {
  applications: [...],
  microservices: [...],
  apis: [...],
  infrastructure: [...]
};
```

### Phase 2: Discovery
```javascript
// Multi-scanner integration
const findings = {
  sast: [...],
  dast: [...],
  sca: [...],
  container: [...]
};
```

### Phase 3: Prioritization
```javascript
// Risk-based scoring
const prioritized = findings.sort((a, b) => {
  return calculateRiskScore(b) - calculateRiskScore(a);
});
```

### Phase 4: Validation
```javascript
// Root cause analysis
const rootCause = traceVulnerability(finding);
const impact = assessBlastRadius(finding);
```

### Phase 5: Mobilization
```javascript
// Actionable remediation
const remediation = {
  guidance: "Update base image to version X",
  affectedServices: [...],
  estimatedEffort: "2 hours",
  priority: "high"
};
```

---

## 🔌 Integration

### Security Scanner Integration

```javascript
// Example: Integrate with Trivy
const scanResults = await fetch('/api/scans/trivy');
const vulnerabilities = await scanResults.json();
```

### CI/CD Integration

```yaml
# GitHub Actions example
- name: Run RiskLens Scan
  run: |
    npm run build
    risklens-cli scan --output results.json
```

### Webhook Integration

```javascript
// Receive scanner results via webhook
app.post('/api/webhooks/scanner', (req, res) => {
  const findings = req.body;
  processFinding(findings);
  res.status(200).send('OK');
});
```

---

## 📈 Analytics & Reporting

### Key Metrics
- Total assets tracked
- Vulnerabilities by severity
- Mean time to remediation (MTTR)
- Security posture trend
- Team performance

### Export Options
- PDF reports
- CSV exports
- JSON API
- Scheduled email reports

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Run with Coverage
```bash
npm test -- --coverage
```

### E2E Testing
```bash
npm run test:e2e
```

---

## 🛠️ Development

### Code Style
- ESLint for linting
- Prettier for formatting
- Husky for pre-commit hooks

### Component Development
```bash
# Create new component
mkdir src/components/NewComponent
touch src/components/NewComponent/NewComponent.js
touch src/components/NewComponent/NewComponent.css
```

### Adding New Features
1. Create feature branch
2. Implement component
3. Add tests
4. Update documentation
5. Submit pull request

---

## 🐛 Troubleshooting

### Issue: Blank page after login
**Solution**: Check browser console for errors. Verify data files exist.

### Issue: Data not loading
**Solution**: Generate sample data with `python generate_sample_data.py`

### Issue: Port already in use
**Solution**: Change port with `PORT=3001 npm start`

### Issue: Build fails
**Solution**: Clear cache with `rm -rf node_modules package-lock.json && npm install`

---

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Complete deployment instructions
- [Marketing Content](MARKETING_CONTENT.md) - Marketing materials and messaging
- [API Documentation](API.md) - Backend API reference (coming soon)
- [User Guide](USER_GUIDE.md) - End-user documentation (coming soon)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 📄 License

Enterprise License - Contact sales@risklens.com for licensing information

---

## 🆘 Support

- **Email**: support@risklens.com
- **Documentation**: https://docs.risklens.com
- **Community**: https://community.risklens.com
- **Status**: https://status.risklens.com

---

## 🎉 Acknowledgments

Built with:
- React 18
- React Bootstrap
- React Router
- Chart.js
- React Icons

Inspired by the CTEM framework and modern security best practices.

---

## 🗺️ Roadmap

### Q1 2024
- [ ] Real-time vulnerability scanning
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] API v2 release

### Q2 2024
- [ ] AI-powered risk prediction
- [ ] Automated remediation workflows
- [ ] Integration marketplace
- [ ] Multi-tenancy support

### Q3 2024
- [ ] Compliance reporting (SOC 2, ISO 27001)
- [ ] Custom dashboards
- [ ] Advanced RBAC
- [ ] Audit logging

---

**Made with ❤️ by the RiskLens Team**

*Transforming Security, One Vulnerability at a Time*
