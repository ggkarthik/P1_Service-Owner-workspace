import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  FaShieldAlt, 
  FaChartLine, 
  FaBolt, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaRobot,
  FaCode,
  FaServer
} from 'react-icons/fa';
import './ServiceOwnerWorkspace.css';

const ServiceOwnerWorkspace = () => {
  const [view, setView] = useState('high-level'); // 'high-level' or 'granular'
  const [selectedService, setSelectedService] = useState(null);
  const [serviceOwnerData, setServiceOwnerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vulnerabilityFilter, setVulnerabilityFilter] = useState('all');
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'ai',
      text: "Hello! I'm your Security Copilot. I can help you understand security risks, recommend remediation actions, and answer questions about your services. How can I assist you today?"
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    fetchServiceOwnerData();
  }, []);

  const fetchServiceOwnerData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/data/service_owner_data.json?t=${new Date().getTime()}`);
      const data = await response.json();
      setServiceOwnerData(data);
      
      // Select the first critical or high risk service by default
      const criticalService = data.services.find(s => s.risk.level === 'Critical' || s.risk.level === 'High');
      setSelectedService(criticalService || data.services[0]);
    } catch (error) {
      console.error('Error fetching service owner data:', error);
    } finally {
      setIsLoading(false);
    }
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
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('risk') || lowerInput.includes('score')) {
      return `The ${service.name} service currently has a risk score of ${service.risk.score}, which is classified as ${service.risk.level}. This is primarily due to ${service.vulnerabilities.total} vulnerabilities, including ${service.vulnerabilities.by_severity.Critical} critical and ${service.vulnerabilities.by_severity.High} high severity issues.`;
    } else if (lowerInput.includes('vulnerabilit')) {
      return `There are ${service.vulnerabilities.total} total vulnerabilities in the ${service.name} service. The breakdown is: ${service.vulnerabilities.by_severity.Critical} Critical, ${service.vulnerabilities.by_severity.High} High, ${service.vulnerabilities.by_severity.Medium} Medium, and ${service.vulnerabilities.by_severity.Low} Low. I recommend prioritizing the Critical vulnerabilities first.`;
    } else if (lowerInput.includes('recommend') || lowerInput.includes('what should')) {
      const topRec = service.ai_insights.recommendations[0];
      return `Based on my analysis, here's my top recommendation: ${topRec.text}. This has a ${topRec.priority} priority and ${topRec.impact} business impact.`;
    } else if (lowerInput.includes('compliance')) {
      return `The ${service.name} service has a compliance adherence score of ${service.compliance.adherence_score}%, with ${service.compliance.failed_controls} failed controls and ${service.compliance.policy_violations} policy violations. The applicable frameworks are: ${service.compliance.applicable_frameworks.join(', ')}.`;
    } else if (lowerInput.includes('remediation') || lowerInput.includes('mttr')) {
      return `The Mean Time To Remediate (MTTR) for ${service.name} is ${service.remediation.mttr_hours} hours. There are currently ${service.remediation.in_progress} vulnerabilities in progress and ${service.remediation.overdue_count} overdue items assigned to ${service.remediation.assigned_teams} teams.`;
    } else if (lowerInput.includes('business') || lowerInput.includes('impact')) {
      return `The ${service.name} service has ${service.business_criticality} business criticality${service.user_facing ? ' and is user-facing' : ''}. Any security incidents could have ${service.risk.business_impact} business impact. It's essential to maintain the security posture of this service.`;
    } else {
      return `I can help you with information about the ${service.name} service, including risk scores, vulnerabilities, compliance status, remediation progress, and recommendations. What would you like to know?`;
    }
  };

  const renderHighLevelView = () => {
    if (!selectedService) return null;

    const { risk, vulnerabilities, exposure, remediation, compliance, composition, ai_insights } = selectedService;

    return (
      <div className="high-level-view">
        {/* Risk Overview */}
        <div className="risk-overview-section">
          <Row>
            <Col md={6}>
              <div className="risk-label">SERVICE RISK SCORE</div>
              <div className="risk-score-large">{risk.score}</div>
              <div className="business-impact">BUSINESS IMPACT: {risk.business_impact}</div>
            </Col>
            <Col md={6}>
              <div className="risk-trend-mini">
                <svg width="100%" height="60" style={{ marginTop: '20px' }}>
                  {risk.trend_30d.map((value, idx) => (
                    <rect
                      key={idx}
                      x={`${(idx / risk.trend_30d.length) * 100}%`}
                      y={60 - (value * 0.6)}
                      width={`${100 / risk.trend_30d.length - 1}%`}
                      height={value * 0.6}
                      fill="rgba(255, 255, 255, 0.6)"
                    />
                  ))}
                </svg>
                <div style={{ textAlign: 'right', marginTop: '5px', fontSize: '14px', opacity: 0.9 }}>
                  30 day trend
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Grid Layout */}
        <div className="grid-2-cols">
          {/* Service Composition */}
          <div className="info-card">
            <h3><FaServer /> Service Composition</h3>
            <div className="composition-diagram">
              <div className="service-box">{selectedService.name}</div>
              <div style={{ margin: '10px 0', fontSize: '24px', color: '#6c757d' }}>↓</div>
              <div className="dependency-boxes">
                {composition.dependencies.length > 0 ? (
                  composition.dependencies.map((dep, idx) => (
                    <div key={idx} className="dependency-box">{dep}</div>
                  ))
                ) : (
                  <div className="dependency-box">No dependencies</div>
                )}
              </div>
              <div style={{ marginTop: '20px', fontSize: '14px', color: '#6c757d' }}>
                <div><strong>Language:</strong> {composition.language}</div>
                <div><strong>Containers:</strong> {composition.containers} | <strong>Pods:</strong> {composition.pods}</div>
              </div>
            </div>
          </div>

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
        <div className="ai-insights-card">
          <h3><FaLightbulb /> AI INSIGHTS & RECOMMENDATIONS</h3>
          {ai_insights.insights.map((insight, idx) => (
            <div key={idx} className="insight-item">
              <div className="insight-icon">
                {idx === 0 ? <FaExclamationTriangle /> : <FaBolt />}
              </div>
              <div className="insight-text">{insight}</div>
            </div>
          ))}
          <div style={{ marginTop: '20px' }}>
            <strong>Next Best Actions:</strong>
            {ai_insights.recommendations.slice(0, 2).map((rec, idx) => (
              <div key={idx} className="insight-item" style={{ marginTop: '10px' }}>
                <div className="insight-icon">•</div>
                <div className="insight-text">
                  {rec.text} 
                  <span style={{ marginLeft: '10px', fontSize: '12px', opacity: 0.8 }}>
                    (Priority: {rec.priority}, Impact: {rec.impact})
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="view-details-btn" onClick={() => setView('granular')}>
            VIEW DETAILED VULNERABILITIES
          </button>
        </div>

        {/* Conversational Copilot */}
        <div className="conversational-copilot">
          <div className="copilot-header">
            <FaRobot style={{ marginRight: '10px' }} />
            CONVERSATIONAL COPILOT
          </div>
          <div className="copilot-messages">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`copilot-message ${msg.type}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="copilot-input-container">
            <input
              type="text"
              className="copilot-input"
              placeholder="Ask a question or request an action..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              className="copilot-send-btn" 
              onClick={handleSendMessage}
              disabled={!chatInput.trim()}
            >
              SEND
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderGranularView = () => {
    if (!selectedService) return null;

    const { vulnerabilities } = selectedService;
    
    // Filter vulnerabilities
    const filteredVulns = vulnerabilityFilter === 'all' 
      ? vulnerabilities.details 
      : vulnerabilities.details.filter(v => v.severity.toLowerCase() === vulnerabilityFilter);

    return (
      <div className="granular-view">
        {/* Vulnerability List */}
        <div className="vulnerability-list">
          <div className="vulnerability-header">
            <h3 style={{ margin: 0 }}>
              <FaShieldAlt style={{ marginRight: '10px' }} />
              Vulnerabilities for {selectedService.name}
            </h3>
            <button className="view-details-btn" onClick={() => setView('high-level')}>
              BACK TO OVERVIEW
            </button>
          </div>
          
          <div className="vuln-filters">
            <button 
              className={`filter-btn ${vulnerabilityFilter === 'all' ? 'active' : ''}`}
              onClick={() => setVulnerabilityFilter('all')}
            >
              All ({vulnerabilities.total})
            </button>
            <button 
              className={`filter-btn ${vulnerabilityFilter === 'critical' ? 'active' : ''}`}
              onClick={() => setVulnerabilityFilter('critical')}
            >
              Critical ({vulnerabilities.by_severity.Critical})
            </button>
            <button 
              className={`filter-btn ${vulnerabilityFilter === 'high' ? 'active' : ''}`}
              onClick={() => setVulnerabilityFilter('high')}
            >
              High ({vulnerabilities.by_severity.High})
            </button>
            <button 
              className={`filter-btn ${vulnerabilityFilter === 'medium' ? 'active' : ''}`}
              onClick={() => setVulnerabilityFilter('medium')}
            >
              Medium ({vulnerabilities.by_severity.Medium})
            </button>
            <button 
              className={`filter-btn ${vulnerabilityFilter === 'low' ? 'active' : ''}`}
              onClick={() => setVulnerabilityFilter('low')}
            >
              Low ({vulnerabilities.by_severity.Low})
            </button>
          </div>

          <table className="vulnerability-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Severity</th>
                <th>CVSS</th>
                <th>Package</th>
                <th>Status</th>
                <th>Team</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVulns.map((vuln, idx) => (
                <tr key={idx}>
                  <td><code>{vuln.id}</code></td>
                  <td>{vuln.type}</td>
                  <td>
                    <span className={`severity-badge ${vuln.severity.toLowerCase()}`}>
                      {vuln.severity}
                    </span>
                  </td>
                  <td>{vuln.cvss_score}</td>
                  <td><code>{vuln.package}</code></td>
                  <td>
                    <span className={`status-badge ${vuln.status.toLowerCase().replace(' ', '-')}`}>
                      {vuln.status}
                    </span>
                  </td>
                  <td>{vuln.assigned_team}</td>
                  <td>
                    <button className="action-btn">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Recommendations for Filtered Vulnerabilities */}
        <div className="ai-insights-card">
          <h3><FaLightbulb /> AI RECOMMENDATIONS</h3>
          {selectedService.ai_insights.recommendations.map((rec, idx) => (
            <div key={idx} className="insight-item">
              <div className="insight-icon">
                {rec.priority === 'High' ? <FaExclamationTriangle /> : <FaBolt />}
              </div>
              <div className="insight-text">
                {rec.text}
                <div style={{ marginTop: '5px', fontSize: '13px', opacity: 0.9 }}>
                  Priority: <strong>{rec.priority}</strong> | 
                  Impact: <strong>{rec.impact}</strong> | 
                  Effort: <strong>{rec.effort}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Container fluid className="service-owner-workspace">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div>Loading service owner workspace...</div>
        </div>
      </Container>
    );
  }

  if (!serviceOwnerData) {
    return (
      <Container fluid className="service-owner-workspace">
        <div className="empty-state">
          <div className="empty-state-icon">
            <FaExclamationTriangle />
          </div>
          <div>No service owner data available</div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="service-owner-workspace">
      {/* Service Selector */}
      <div className="service-selector">
        <h3>SELECT A SERVICE</h3>
        <div className="service-grid">
          {serviceOwnerData.services.map((service, idx) => (
            <div
              key={idx}
              className={`service-card ${selectedService?.name === service.name ? 'selected' : ''}`}
              onClick={() => setSelectedService(service)}
            >
              <div className="service-card-header">
                <div className="service-name">{service.name}</div>
                <div className={`risk-badge ${service.risk.level.toLowerCase()}`}>
                  {service.risk.level}
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '8px' }}>
                {service.description}
              </div>
              <div className="service-meta">
                <div className="meta-item">
                  <FaCode />
                  {service.language}
                </div>
                <div className="meta-item">
                  <FaShieldAlt />
                  {service.vulnerabilities.total} vulns
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Toggle */}
      <div className="view-toggle">
        <button
          className={`view-toggle-btn ${view === 'high-level' ? 'active' : ''}`}
          onClick={() => setView('high-level')}
        >
          HIGH-LEVEL VIEW
        </button>
        <button
          className={`view-toggle-btn ${view === 'granular' ? 'active' : ''}`}
          onClick={() => setView('granular')}
        >
          GRANULAR VIEW
        </button>
      </div>

      {/* Render Current View */}
      {view === 'high-level' ? renderHighLevelView() : renderGranularView()}
    </Container>
  );
};

export default ServiceOwnerWorkspace;
