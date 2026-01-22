import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Container } from 'react-bootstrap';
import { 
  FaShieldAlt, 
  FaChartLine, 
  FaBolt, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaRobot,
  FaArrowLeft,
  FaUserShield
} from 'react-icons/fa';
import './ServiceOwnerWorkspace.css';
import ServiceInventory from './ServiceInventory';
import './MicroservicesTab.css';

const MicroservicesTab = ({ services }) => {
  // Add null check for services
  const servicesList = services || [];
  
  // Service Owner Workspace states
  const [selectedService, setSelectedService] = useState(null);
  const [serviceOwnerData, setServiceOwnerData] = useState(null);
  const [serviceInventoryData, setServiceInventoryData] = useState(null);
  const [serviceOwnerView, setServiceOwnerView] = useState(null); // null, 'high-level', or 'granular'
  const [isLoading, setIsLoading] = useState(false);
  const [vulnerabilityFilter, setVulnerabilityFilter] = useState('all');
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'ai',
      text: "Hello! I'm your Security Copilot. I can help you understand security risks, recommend remediation actions, and answer questions about your services. How can I assist you today?"
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    // Fetch service owner data and service inventory data when component mounts
    fetchServiceOwnerData();
    fetchServiceInventoryData();
  }, []);
  
  const fetchServiceInventoryData = async () => {
    try {
      const response = await fetch(`/data/service_inventory.json?t=${new Date().getTime()}`);
      const data = await response.json();
      setServiceInventoryData(data);
    } catch (error) {
      console.error('Error fetching service inventory data:', error);
    }
  };

  const fetchServiceOwnerData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/data/service_owner_data.json?t=${new Date().getTime()}`);
      const data = await response.json();
      setServiceOwnerData(data);
    } catch (error) {
      console.error('Error fetching service owner data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLanguageClass = (language) => {
    if (!language) return '';
    const lang = language.split('/')[0].replace('.', '');
    return lang;
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage = { type: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);

    // Generate AI response based on the input
    setTimeout(() => {
      const aiResponse = generateAIResponse(chatInput, selectedService);
      setChatMessages(prev => [...prev, { type: 'ai', text: aiResponse }]);
    }, 500);

    setChatInput('');
  };

  const generateAIResponse = (input, service) => {
    if (!service) return "Please select a service first.";
    
    const lowerInput = input.toLowerCase();
    const serviceData = serviceOwnerData?.services.find(s => s.name === service.name);
    
    if (!serviceData) return "I don't have detailed information about this service yet.";
    
    if (lowerInput.includes('risk') || lowerInput.includes('score')) {
      return `The ${serviceData.name} service currently has a risk score of ${serviceData.risk.score}, which is classified as ${serviceData.risk.level}. This is primarily due to ${serviceData.vulnerabilities.total} vulnerabilities, including ${serviceData.vulnerabilities.by_severity.Critical} critical and ${serviceData.vulnerabilities.by_severity.High} high severity issues.`;
    } else if (lowerInput.includes('vulnerabilit')) {
      return `There are ${serviceData.vulnerabilities.total} total vulnerabilities in the ${serviceData.name} service. The breakdown is: ${serviceData.vulnerabilities.by_severity.Critical} Critical, ${serviceData.vulnerabilities.by_severity.High} High, ${serviceData.vulnerabilities.by_severity.Medium} Medium, and ${serviceData.vulnerabilities.by_severity.Low} Low. I recommend prioritizing the Critical vulnerabilities first.`;
    } else if (lowerInput.includes('recommend') || lowerInput.includes('what should')) {
      const topRec = serviceData.ai_insights.recommendations[0];
      return `Based on my analysis, here's my top recommendation: ${topRec.text}. This has a ${topRec.priority} priority and ${topRec.impact} business impact.`;
    } else if (lowerInput.includes('compliance')) {
      return `The ${serviceData.name} service has a compliance adherence score of ${serviceData.compliance.adherence_score}%, with ${serviceData.compliance.failed_controls} failed controls and ${serviceData.compliance.policy_violations} policy violations. The applicable frameworks are: ${serviceData.compliance.applicable_frameworks.join(', ')}.`;
    } else if (lowerInput.includes('remediation') || lowerInput.includes('mttr')) {
      return `The Mean Time To Remediate (MTTR) for ${serviceData.name} is ${serviceData.remediation.mttr_hours} hours. There are currently ${serviceData.remediation.in_progress} vulnerabilities in progress and ${serviceData.remediation.overdue_count} overdue items assigned to ${serviceData.remediation.assigned_teams} teams.`;
    } else if (lowerInput.includes('business') || lowerInput.includes('impact')) {
      return `The ${serviceData.name} service has ${serviceData.business_criticality} business criticality${serviceData.user_facing ? ' and is user-facing' : ''}. Any security incidents could have ${serviceData.risk.business_impact} business impact. It's essential to maintain the security posture of this service.`;
    } else {
      return `I can help you with information about the ${serviceData.name} service, including risk scores, vulnerabilities, compliance status, remediation progress, and recommendations. What would you like to know?`;
    }
  };

  const renderHighLevelView = () => {
    if (!selectedService || !serviceOwnerData) return null;
    
    const serviceData = serviceOwnerData.services.find(s => s.name === selectedService.name);
    if (!serviceData) return <div className="alert alert-warning">No detailed data available for this service.</div>;

    const { risk, vulnerabilities, exposure, remediation, compliance, composition, ai_insights } = serviceData;
    
    // Calculate risk level color
    const getRiskColor = (score) => {
      if (score >= 80) return '#dc3545'; // Critical - red
      if (score >= 60) return '#fd7e14'; // High - orange
      if (score >= 40) return '#ffc107'; // Medium - yellow
      return '#28a745'; // Low - green
    };
    
    // Calculate risk level
    const getRiskLevel = (score) => {
      if (score >= 80) return 'Critical';
      if (score >= 60) return 'High';
      if (score >= 40) return 'Medium';
      return 'Low';
    };
    
    // Calculate rotation for gauge
    const gaugeRotation = (risk.score / 100) * 180;

    return (
      <div className="high-level-view">
        {/* Risk Overview - Gauge Style */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3><FaShieldAlt /> Service Risk Overview</h3>
            <span className="text-muted">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
          <div className="dashboard-card-body">
            <Row>
              <Col md={5}>
                <div className="risk-gauge-container">
                  <div className="risk-gauge-bg"></div>
                  <div 
                    className="risk-gauge-fill" 
                    style={{ 
                      background: getRiskColor(risk.score),
                      transform: `rotate(${gaugeRotation}deg)`
                    }}
                  ></div>
                  <div className="risk-gauge-center">
                    <div className="risk-score-large" style={{ color: getRiskColor(risk.score) }}>{risk.score}</div>
                    <div className="risk-score-text">Risk Score</div>
                  </div>
                </div>
                
                <div className="risk-level-indicator">
                  <div className="risk-level-item">
                    <div className="risk-level-marker low"></div>
                    <div className={`risk-level-label ${risk.level === 'Low' ? 'risk-level-active' : ''}`}>Low</div>
                  </div>
                  <div className="risk-level-item">
                    <div className="risk-level-marker medium"></div>
                    <div className={`risk-level-label ${risk.level === 'Medium' ? 'risk-level-active' : ''}`}>Medium</div>
                  </div>
                  <div className="risk-level-item">
                    <div className="risk-level-marker high"></div>
                    <div className={`risk-level-label ${risk.level === 'High' ? 'risk-level-active' : ''}`}>High</div>
                  </div>
                  <div className="risk-level-item">
                    <div className="risk-level-marker critical"></div>
                    <div className={`risk-level-label ${risk.level === 'Critical' ? 'risk-level-active' : ''}`}>Critical</div>
                  </div>
                </div>
              </Col>
              
              <Col md={7}>
                <div className="business-impact">
                  Business Impact: 
                  <span className={`business-impact-badge ${risk.business_impact.toLowerCase()}`}>
                    {risk.business_impact}
                  </span>
                </div>
                
                <div style={{ marginTop: '20px' }}>
                  <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Risk Factors:</h5>
                  <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
                    <li>Vulnerabilities: <strong>{vulnerabilities.total}</strong> ({vulnerabilities.by_severity.Critical} critical, {vulnerabilities.by_severity.High} high)</li>
                    <li>Exposure: <strong>{exposure.network_exposure}</strong> ({exposure.public_endpoints} public endpoints)</li>
                    <li>Compliance: <strong>{compliance.adherence_score}%</strong> adherence ({compliance.failed_controls} failed controls)</li>
                  </ul>
                </div>
                
                <div className="risk-trend-mini">
                  <div style={{ fontSize: '13px', marginBottom: '5px', color: '#6c757d' }}>30-Day Risk Trend:</div>
                  <svg width="100%" height="40">
                    {risk.trend_30d.map((value, idx) => {
                      const color = getRiskColor(value);
                      return (
                        <rect
                          key={idx}
                          x={`${(idx / risk.trend_30d.length) * 100}%`}
                          y={40 - (value * 0.4)}
                          width={`${100 / risk.trend_30d.length - 1}%`}
                          height={value * 0.4}
                          fill={color}
                          opacity="0.7"
                        />
                      );
                    })}
                  </svg>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid-2-cols">
          {/* Service Composition & Inventory */}
          <ServiceInventory 
            selectedService={selectedService} 
            serviceInventoryData={serviceInventoryData} 
          />

          {/* Exposure Overview */}
          <div className="info-card">
            <h3><FaChartLine /> Exposure Overview</h3>
            <div className="exposure-bars">
              <div className="exposure-bar">
                <div className="exposure-bar-label">
                  <span>Critical</span>
                  <span>{vulnerabilities.by_severity.Critical}</span>
                </div>
                <div className="bar-container">
                  <div 
                    className="bar-fill critical" 
                    style={{ width: `${(vulnerabilities.by_severity.Critical / vulnerabilities.total) * 100}%` }}
                  >
                    {vulnerabilities.by_severity.Critical}
                  </div>
                </div>
              </div>
              <div className="exposure-bar">
                <div className="exposure-bar-label">
                  <span>High</span>
                  <span>{vulnerabilities.by_severity.High}</span>
                </div>
                <div className="bar-container">
                  <div 
                    className="bar-fill high" 
                    style={{ width: `${(vulnerabilities.by_severity.High / vulnerabilities.total) * 100}%` }}
                  >
                    {vulnerabilities.by_severity.High}
                  </div>
                </div>
              </div>
              <div className="exposure-bar">
                <div className="exposure-bar-label">
                  <span>Medium</span>
                  <span>{vulnerabilities.by_severity.Medium}</span>
                </div>
                <div className="bar-container">
                  <div 
                    className="bar-fill medium" 
                    style={{ width: `${(vulnerabilities.by_severity.Medium / vulnerabilities.total) * 100}%` }}
                  >
                    {vulnerabilities.by_severity.Medium}
                  </div>
                </div>
              </div>
              <div className="exposure-bar">
                <div className="exposure-bar-label">
                  <span>Low</span>
                  <span>{vulnerabilities.by_severity.Low}</span>
                </div>
                <div className="bar-container">
                  <div 
                    className="bar-fill low" 
                    style={{ width: `${(vulnerabilities.by_severity.Low / vulnerabilities.total) * 100}%` }}
                  >
                    {vulnerabilities.by_severity.Low}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Remediation Progress */}
          <div className="info-card">
            <h3><FaBolt /> Remediation Progress</h3>
            <div className="remediation-stats">
              <div className="remediation-stat">
                <div className="stat-value">{remediation.breaches}</div>
                <div className="stat-label">Breaches</div>
              </div>
              <div className="remediation-stat">
                <div className="stat-value">{remediation.mttr_hours}h</div>
                <div className="stat-label">MTTR</div>
              </div>
              <div className="remediation-stat">
                <div className="stat-value">{remediation.assigned_teams}</div>
                <div className="stat-label">Assigned Teams</div>
              </div>
            </div>
            <div style={{ marginTop: '20px', fontSize: '14px', color: '#6c757d' }}>
              <div>Open: <strong>{vulnerabilities.open}</strong></div>
              <div>In Progress: <strong>{remediation.in_progress}</strong></div>
              <div>Overdue: <strong style={{ color: '#dc3545' }}>{remediation.overdue_count}</strong></div>
            </div>
          </div>

          {/* Compliance Posture */}
          <div className="info-card">
            <h3><FaCheckCircle /> Compliance Posture</h3>
            <div className="compliance-score-circle">
              <div className="score-circle" style={{ 
                background: `conic-gradient(#28a745 0deg ${compliance.adherence_score * 3.6}deg, #e9ecef ${compliance.adherence_score * 3.6}deg 360deg)` 
              }}>
                <div className="score-circle-inner">
                  <div className="score-number">{compliance.adherence_score}</div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>SCORE</div>
                </div>
              </div>
            </div>
            <div className="compliance-details">
              <div className="compliance-item">
                <div className="compliance-value">{compliance.applicable_frameworks.length}</div>
                <div className="compliance-label">Frameworks</div>
              </div>
              <div className="compliance-item">
                <div className="compliance-value" style={{ color: '#dc3545' }}>{compliance.failed_controls}</div>
                <div className="compliance-label">Failed Controls</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3><FaLightbulb /> AI Insights & Recommendations</h3>
            <div className="ai-confidence">
              <FaRobot style={{ fontSize: '14px' }} />
              <span>Confidence: {Math.round(ai_insights.confidence_score * 100)}%</span>
            </div>
          </div>
          <div className="dashboard-card-body">
            <div className="ai-insights-header">
              <h5 style={{ fontSize: '14px', fontWeight: '600', margin: '0' }}>Key Insights</h5>
              <Badge bg={ai_insights.risk_trend === 'increasing' ? 'danger' : ai_insights.risk_trend === 'decreasing' ? 'success' : 'warning'}>
                Risk Trend: {ai_insights.risk_trend.charAt(0).toUpperCase() + ai_insights.risk_trend.slice(1)}
              </Badge>
            </div>
            
            {ai_insights.insights.map((insight, idx) => {
              // Determine insight priority based on content
              let priority = 'medium';
              if (insight.toLowerCase().includes('critical') || insight.toLowerCase().includes('breach')) {
                priority = 'critical';
              } else if (insight.toLowerCase().includes('high') || insight.toLowerCase().includes('exploit')) {
                priority = 'high';
              }
              
              return (
                <div key={idx} className={`insight-item ${priority}`}>
                  <div className={`insight-icon ${priority}`}>
                    {priority === 'critical' ? <FaExclamationTriangle /> : <FaBolt />}
                  </div>
                  <div className="insight-text">{insight}</div>
                </div>
              );
            })}
            
            <div style={{ marginTop: '20px', borderTop: '1px solid #e9ecef', paddingTop: '15px' }}>
              <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Recommended Actions</h5>
              {ai_insights.recommendations.slice(0, 2).map((rec, idx) => (
                <div key={idx} className={`insight-item ${rec.priority.toLowerCase()}`} style={{ marginTop: '10px' }}>
                  <div className={`insight-icon ${rec.priority.toLowerCase()}`}>
                    {rec.priority === 'High' ? <FaExclamationTriangle /> : <FaBolt />}
                  </div>
                  <div className="insight-text">
                    {rec.text}
                    <div className="insight-meta">
                      <div className="insight-meta-item">
                        <strong>Priority:</strong> {rec.priority}
                      </div>
                      <div className="insight-meta-item">
                        <strong>Impact:</strong> {rec.impact}
                      </div>
                      <div className="insight-meta-item">
                        <strong>Effort:</strong> {rec.effort}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button className="view-details-btn" onClick={() => setServiceOwnerView('granular')}>
                View Detailed Vulnerabilities
              </button>
              <span style={{ fontSize: '13px', color: '#6c757d', alignSelf: 'center' }}>
                Predicted Risk (30d): {ai_insights.predicted_risk_30d}
              </span>
            </div>
          </div>
        </div>

        {/* Conversational Copilot */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>
              <FaRobot style={{ marginRight: '8px' }} />
              AI Security Copilot
            </h3>
            <Badge bg="info">Beta</Badge>
          </div>
          <div className="dashboard-card-body" style={{ padding: '0' }}>
            <div className="copilot-messages" style={{ maxHeight: '250px', overflowY: 'auto', padding: '15px', background: '#f8f9fa' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="d-flex mb-3" style={{ justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div 
                    style={{
                      maxWidth: '80%',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      background: msg.type === 'user' ? '#667eea' : 'white',
                      color: msg.type === 'user' ? 'white' : '#212529',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      border: msg.type === 'user' ? 'none' : '1px solid #dee2e6'
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', padding: '15px', borderTop: '1px solid #e9ecef' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Ask about security risks, vulnerabilities, or recommendations..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                style={{ marginRight: '10px' }}
              />
              <Button 
                variant="primary"
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
              >
                Send
              </Button>
            </div>
            <div style={{ padding: '0 15px 15px', fontSize: '12px', color: '#6c757d' }}>
              <FaLightbulb style={{ marginRight: '5px' }} />
              Try asking: "What are my biggest security risks?" or "How can I improve my compliance score?"
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGranularView = () => {
    if (!selectedService || !serviceOwnerData) return null;
    
    const serviceData = serviceOwnerData.services.find(s => s.name === selectedService.name);
    if (!serviceData) return <div className="alert alert-warning">No detailed data available for this service.</div>;

    const { vulnerabilities } = serviceData;
    
    // Filter vulnerabilities
    const filteredVulns = vulnerabilityFilter === 'all' 
      ? vulnerabilities.details 
      : vulnerabilities.details.filter(v => v.severity.toLowerCase() === vulnerabilityFilter);

    return (
      <div className="granular-view">
        {/* Vulnerability List */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>
              <FaShieldAlt style={{ marginRight: '8px' }} />
              Vulnerabilities for {selectedService.name}
            </h3>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => setServiceOwnerView('high-level')}
            >
              <FaArrowLeft style={{ marginRight: '5px' }} /> Back to Overview
            </Button>
          </div>
          <div className="dashboard-card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <Badge bg="danger" className="me-2">{vulnerabilities.by_severity.Critical} Critical</Badge>
                <Badge bg="warning" text="dark" className="me-2">{vulnerabilities.by_severity.High} High</Badge>
                <Badge bg="primary" className="me-2">{vulnerabilities.by_severity.Medium} Medium</Badge>
                <Badge bg="success">{vulnerabilities.by_severity.Low} Low</Badge>
              </div>
              <div className="d-flex align-items-center">
                <span className="me-2" style={{ fontSize: '14px', color: '#6c757d' }}>Filter:</span>
                <div className="btn-group">
                  <Button 
                    variant={vulnerabilityFilter === 'all' ? 'primary' : 'outline-secondary'} 
                    size="sm"
                    onClick={() => setVulnerabilityFilter('all')}
                  >
                    All ({vulnerabilities.total})
                  </Button>
                  <Button 
                    variant={vulnerabilityFilter === 'critical' ? 'danger' : 'outline-secondary'} 
                    size="sm"
                    onClick={() => setVulnerabilityFilter('critical')}
                  >
                    Critical
                  </Button>
                  <Button 
                    variant={vulnerabilityFilter === 'high' ? 'warning' : 'outline-secondary'} 
                    size="sm"
                    onClick={() => setVulnerabilityFilter('high')}
                  >
                    High
                  </Button>
                  <Button 
                    variant={vulnerabilityFilter === 'medium' ? 'primary' : 'outline-secondary'} 
                    size="sm"
                    onClick={() => setVulnerabilityFilter('medium')}
                  >
                    Medium
                  </Button>
                  <Button 
                    variant={vulnerabilityFilter === 'low' ? 'success' : 'outline-secondary'} 
                    size="sm"
                    onClick={() => setVulnerabilityFilter('low')}
                  >
                    Low
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="vulnerability-table-container">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Severity</th>
                    <th>CVSS</th>
                    <th>Package</th>
                    <th>Status</th>
                    <th>Team</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVulns.length > 0 ? (
                    filteredVulns.map((vuln, idx) => (
                      <tr key={idx}>
                        <td><code>{vuln.id}</code></td>
                        <td>{vuln.type}</td>
                        <td>
                          <Badge 
                            bg={
                              vuln.severity === 'Critical' ? 'danger' : 
                              vuln.severity === 'High' ? 'warning' : 
                              vuln.severity === 'Medium' ? 'primary' : 'success'
                            }
                            text={vuln.severity === 'High' || vuln.severity === 'Medium' ? 'dark' : undefined}
                          >
                            {vuln.severity}
                          </Badge>
                        </td>
                        <td>{vuln.cvss_score}</td>
                        <td><code>{vuln.package}</code></td>
                        <td>
                          <Badge 
                            bg={
                              vuln.status === 'Open' ? 'danger' : 
                              vuln.status === 'In Progress' ? 'warning' : 
                              vuln.status === 'Resolved' ? 'success' : 'info'
                            }
                            text={vuln.status === 'In Progress' ? 'dark' : undefined}
                          >
                            {vuln.status}
                          </Badge>
                        </td>
                        <td>{vuln.assigned_team}</td>
                        <td>
                          <div className="vuln-actions">
                            <button className="vuln-action-btn view">View</button>
                            <button className="vuln-action-btn fix">Fix</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        No vulnerabilities match the selected filter
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Recommendations for Filtered Vulnerabilities */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3><FaLightbulb /> AI Recommendations</h3>
            <Badge bg="info">Based on {filteredVulns.length} vulnerabilities</Badge>
          </div>
          <div className="dashboard-card-body">
            {serviceData.ai_insights.recommendations.map((rec, idx) => {
              const priority = rec.priority.toLowerCase();
              return (
                <div key={idx} className={`insight-item ${priority}`}>
                  <div className={`insight-icon ${priority}`}>
                    {rec.priority === 'High' ? <FaExclamationTriangle /> : <FaBolt />}
                  </div>
                  <div className="insight-text">
                    {rec.text}
                    <div className="insight-meta">
                      <div className="insight-meta-item">
                        <strong>Priority:</strong> {rec.priority}
                      </div>
                      <div className="insight-meta-item">
                        <strong>Impact:</strong> {rec.impact}
                      </div>
                      <div className="insight-meta-item">
                        <strong>Effort:</strong> {rec.effort}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="mt-3 text-end">
              <Button variant="outline-primary" size="sm">
                Generate Remediation Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderServiceOwnerView = () => {
    if (serviceOwnerView === 'high-level') {
      return renderHighLevelView();
    } else if (serviceOwnerView === 'granular') {
      return renderGranularView();
    }
    return null;
  };

  const renderServiceCard = (service) => {
    if (!service) return null;
    const name = service.name || 'Unknown Service';
    const language = service.language || 'Unknown';
    const description = service.description || 'No description available.';
    const path = service.path || '';
    
    // Get risk data if available
    const serviceData = serviceOwnerData?.services.find(s => s.name === name);
    const riskLevel = serviceData?.risk?.level || null;
    const riskScore = serviceData?.risk?.score || null;
    const vulnCount = serviceData?.vulnerabilities?.total || null;
    
    const getRiskBadgeClass = (level) => {
      if (!level) return '';
      switch(level.toLowerCase()) {
        case 'critical': return 'danger';
        case 'high': return 'warning';
        case 'medium': return 'primary';
        case 'low': return 'success';
        default: return 'secondary';
      }
    };
    
    const isSelected = selectedService && selectedService.name === name;
    
    return (
      <Col md={4} key={name}>
        <Card 
          className={`service-card mb-4 ${isSelected ? 'selected-service' : ''}`}
          onClick={() => {
            setSelectedService(service);
            setServiceOwnerView('high-level');
          }}
        >
          <Card.Header className="service-header d-flex justify-content-between align-items-center">
            <span>{name}</span>
            <div>
              <span className={`service-language ${getLanguageClass(language)} mr-2`}>
                {language}
              </span>
              {riskLevel && (
                <Badge bg={getRiskBadgeClass(riskLevel)} className="ml-2">
                  {riskLevel}
                </Badge>
              )}
            </div>
          </Card.Header>
          <Card.Body>
            <p>{description}</p>
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">Path: {path}</small>
              {riskScore && (
                <div className="d-flex align-items-center">
                  <FaShieldAlt className="mr-1" style={{ color: '#6c757d', marginRight: '5px' }} />
                  <span>Risk: {riskScore}</span>
                  {vulnCount && (
                    <span className="ml-2" style={{ marginLeft: '10px' }}>
                      ({vulnCount} vulns)
                    </span>
                  )}
                </div>
              )}
            </div>
            {isSelected && (
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="mt-2 w-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setServiceOwnerView('high-level');
                }}
              >
                <FaUserShield className="mr-2" style={{ marginRight: '5px' }} />
                View Service Owner Dashboard
              </Button>
            )}
          </Card.Body>
        </Card>
      </Col>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading service data...</p>
      </div>
    );
  }

  // If a service is selected and we're in service owner view mode
  if (selectedService && serviceOwnerView) {
    return (
      <Container fluid className="p-0">
        <div className="d-flex align-items-center mb-4">
          <Button 
            variant="outline-secondary" 
            className="mr-3" 
            onClick={() => setServiceOwnerView(null)}
            style={{ marginRight: '15px' }}
          >
            <FaArrowLeft /> Back to Services
          </Button>
          <h2 className="mb-0">{selectedService.name} Service Owner Dashboard</h2>
        </div>
        
        <div className="view-toggle mb-4">
          <button
            className={`view-toggle-btn ${serviceOwnerView === 'high-level' ? 'active' : ''}`}
            onClick={() => setServiceOwnerView('high-level')}
          >
            HIGH-LEVEL VIEW
          </button>
          <button
            className={`view-toggle-btn ${serviceOwnerView === 'granular' ? 'active' : ''}`}
            onClick={() => setServiceOwnerView('granular')}
          >
            GRANULAR VIEW
          </button>
        </div>
        
        {renderServiceOwnerView()}
      </Container>
    );
  }

  // Default view - service cards
  return (
    <div>
      <h2 className="mb-4">Microservices</h2>
      {servicesList.length === 0 ? (
        <div className="alert alert-info">No microservices data available.</div>
      ) : (
        <>
          <div className="alert alert-info mb-4">
            <FaUserShield className="mr-2" style={{ marginRight: '8px' }} />
            <strong>Service Owner Dashboard:</strong> Click on any service card to view detailed security risk information and AI-powered insights.
          </div>
          <Row>
            {servicesList.map((service) => renderServiceCard(service))}
          </Row>
        </>
      )}
    </div>
  );
};

export default MicroservicesTab;
