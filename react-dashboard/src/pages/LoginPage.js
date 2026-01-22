import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import '../styles/theme.css';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Demo credentials for testing
    if (email === 'demo@first.com' && password === 'demo123') {
      // Store auth token
      localStorage.setItem('authToken', 'demo-token-' + Date.now());
      localStorage.setItem('userEmail', email);
      
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 1000);
    } else {
      setTimeout(() => {
        setLoading(false);
        setError('Invalid credentials. Try demo@first.com / demo123');
      }, 1000);
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={10}>
            <Card className="login-card">
              <Row className="g-0">
                {/* Left Side - Branding */}
                <Col lg={6} className="login-branding">
                  <div className="branding-content">
                    <div className="logo-section">
                      <Logo size="xlarge" variant="full" />
                    </div>
                    <h2 className="mt-4">Enterprise Risk Intelligence</h2>
                    <p className="tagline">
                      Transform security chaos into actionable insights
                    </p>
                    
                    <div className="stats-grid">
                      <div className="stat-item">
                        <div className="stat-value">10K+</div>
                        <div className="stat-label">Assets Tracked</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">87%</div>
                        <div className="stat-label">Risk Reduction</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">3.2x</div>
                        <div className="stat-label">Faster Remediation</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">500+</div>
                        <div className="stat-label">Enterprise Clients</div>
                      </div>
                    </div>

                    <div className="features-list">
                      <div className="feature-badge">✓ Multi-Scanner Integration</div>
                      <div className="feature-badge">✓ Root Cause Analysis</div>
                      <div className="feature-badge">✓ CTEM Framework</div>
                      <div className="feature-badge">✓ Real-time Insights</div>
                    </div>
                  </div>
                </Col>

                {/* Right Side - Login Form */}
                <Col lg={6} className="login-form-section">
                  <div className="form-content">
                    <div className="form-header">
                      <h3>Welcome Back</h3>
                      <p>Sign in to access your risk intelligence dashboard</p>
                    </div>

                    {error && (
                      <Alert variant="danger" dismissible onClose={() => setError('')}>
                        {error}
                      </Alert>
                    )}

                    <Form onSubmit={handleLogin}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <div className="input-with-icon">
                          <FaEnvelope className="input-icon" />
                          <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <div className="input-with-icon">
                          <FaLock className="input-icon" />
                          <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </Form.Group>

                      <div className="form-options">
                        <Form.Check 
                          type="checkbox"
                          label="Remember me"
                          className="remember-me"
                        />
                        <a href="#forgot" className="forgot-password">Forgot Password?</a>
                      </div>

                      <Button 
                        variant="primary" 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                      >
                        {loading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </Form>

                    <div className="demo-credentials">
                      <p className="demo-label">Demo Credentials:</p>
                      <p className="demo-info">
                        <strong>Email:</strong> demo@first.com<br />
                        <strong>Password:</strong> demo123
                      </p>
                    </div>

                    <div className="signup-link">
                      Don't have an account? <a href="#signup">Request Access</a>
                    </div>

                    <div className="back-home">
                      <Button 
                        variant="link" 
                        onClick={() => navigate('/')}
                      >
                        ← Back to Home
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
