import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FaShieldAlt, FaSearch, FaChartLine, FaBullseye, FaTools, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import '../styles/theme.css';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const ctmPhases = [
    {
      icon: <FaSearch size={40} />,
      title: "Scoping",
      description: "Comprehensive asset discovery and inventory management. Identify all applications, services, and infrastructure components across your organization.",
      color: "#4A90E2"
    },
    {
      icon: <FaShieldAlt size={40} />,
      title: "Discovery",
      description: "Automated vulnerability scanning and risk detection from multiple security tools. Aggregate findings from SAST, DAST, SCA, and container scanners.",
      color: "#7B68EE"
    },
    {
      icon: <FaChartLine size={40} />,
      title: "Prioritization",
      description: "Intelligent risk scoring and prioritization. View vulnerabilities through multiple lenses - by severity, exploitability, business impact, and asset criticality.",
      color: "#FF6B6B"
    },
    {
      icon: <FaBullseye size={40} />,
      title: "Validation",
      description: "Understand the root cause of security findings. Trace vulnerabilities to their source - dependencies, base images, code patterns, and configurations.",
      color: "#FFA500"
    },
    {
      icon: <FaTools size={40} />,
      title: "Mobilization",
      description: "Empower remediation teams with actionable insights. Fix multiple interlinked findings efficiently by addressing root causes, not just symptoms.",
      color: "#50C878"
    }
  ];

  const features = [
    {
      title: "Enterprise Asset Inventory",
      description: "Complete visibility into your application portfolio, microservices, APIs, and infrastructure",
      icon: <FaCheckCircle size={24} />
    },
    {
      title: "Multi-Scanner Integration",
      description: "Aggregate security findings from all your scanning tools in one unified platform",
      icon: <FaCheckCircle size={24} />
    },
    {
      title: "Risk Intelligence",
      description: "Advanced analytics and multiple perspectives to understand true organizational risk",
      icon: <FaCheckCircle size={24} />
    },
    {
      title: "Root Cause Analysis",
      description: "Trace vulnerabilities to their source and understand dependency chains",
      icon: <FaCheckCircle size={24} />
    },
    {
      title: "Efficient Remediation",
      description: "Fix multiple findings at once by addressing underlying issues",
      icon: <FaCheckCircle size={24} />
    },
    {
      title: "Team Collaboration",
      description: "Service owner workspaces for distributed security responsibility",
      icon: <FaCheckCircle size={24} />
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="mb-4">
                <Logo size="large" variant="full" />
              </div>
              <h1 className="hero-title">
                Enterprise-Grade <span className="highlight">Risk Intelligence</span> Platform
              </h1>
              <p className="hero-subtitle">
                Transform security chaos into actionable insights. Discover, prioritize, and remediate vulnerabilities with unprecedented clarity.
              </p>
              <div className="hero-buttons">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="cta-button"
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg" 
                  className="demo-button"
                  onClick={() => navigate('/login')}
                >
                  Request Demo
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image">
                <div className="floating-card card-1">
                  <FaShieldAlt size={30} color="#4A90E2" />
                  <div>
                    <div className="metric-value">10,247</div>
                    <div className="metric-label">Assets Tracked</div>
                  </div>
                </div>
                <div className="floating-card card-2">
                  <FaChartLine size={30} color="#50C878" />
                  <div>
                    <div className="metric-value">87%</div>
                    <div className="metric-label">Risk Reduction</div>
                  </div>
                </div>
                <div className="floating-card card-3">
                  <FaTools size={30} color="#FF6B6B" />
                  <div>
                    <div className="metric-value">3.2x</div>
                    <div className="metric-label">Faster Remediation</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTEM Phases Section */}
      <section className="ctem-section">
        <Container>
          <div className="section-header">
            <h2>Built on CTEM Framework</h2>
            <p>Continuous Threat Exposure Management - A systematic approach to security</p>
          </div>
          <Row>
            {ctmPhases.map((phase, index) => (
              <Col lg={4} md={6} key={index} className="mb-4">
                <Card className="ctem-card" style={{ borderTop: `4px solid ${phase.color}` }}>
                  <Card.Body>
                    <div className="ctem-icon" style={{ color: phase.color }}>
                      {phase.icon}
                    </div>
                    <h3>{phase.title}</h3>
                    <p>{phase.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <div className="section-header">
            <h2>Comprehensive Security Platform</h2>
            <p>Everything you need to manage enterprise security at scale</p>
          </div>
          <Row>
            {features.map((feature, index) => (
              <Col lg={4} md={6} key={index} className="mb-4">
                <div className="feature-item">
                  <div className="feature-icon">{feature.icon}</div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases-section">
        <Container>
          <div className="section-header">
            <h2>Who Benefits?</h2>
          </div>
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <Card className="use-case-card">
                <Card.Body>
                  <h3>Security Teams</h3>
                  <p>Get a unified view of risk across all assets. Prioritize remediation efforts based on true business impact and exploitability.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <Card className="use-case-card">
                <Card.Body>
                  <h3>Development Teams</h3>
                  <p>Understand the root cause of vulnerabilities. Fix issues at the source - whether it's a dependency, base image, or code pattern.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <Card className="use-case-card">
                <Card.Body>
                  <h3>Leadership</h3>
                  <p>Track security posture trends, measure remediation velocity, and demonstrate compliance with clear metrics and reporting.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2>Ready to Transform Your Security Program?</h2>
              <p>Join leading enterprises in adopting a data-driven approach to risk management</p>
              <Button 
                variant="light" 
                size="lg" 
                className="cta-button-secondary"
                onClick={() => navigate('/login')}
              >
                Start Your Free Trial
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <Container>
          <Row>
            <Col lg={4}>
              <Logo size="medium" variant="full" />
              <p className="mt-3">Enterprise Risk Intelligence Platform</p>
            </Col>
            <Col lg={4}>
              <h5>Product</h5>
              <ul>
                <li>Features</li>
                <li>Integrations</li>
                <li>Pricing</li>
                <li>Documentation</li>
              </ul>
            </Col>
            <Col lg={4}>
              <h5>Company</h5>
              <ul>
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </Col>
          </Row>
          <div className="footer-bottom">
            <p>&copy; 2024 RiskLens. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
