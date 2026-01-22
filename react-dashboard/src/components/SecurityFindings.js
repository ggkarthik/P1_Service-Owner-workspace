import React, { useState, useEffect } from 'react';
import { Card, Badge, Tabs, Tab, Row, Col, Table, ProgressBar, Alert, Form } from 'react-bootstrap';
import { FaCode, FaDocker, FaCloudversify, FaExclamationTriangle, FaExclamationCircle, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';
import PipelineView from './PipelineView';
import NewMetricCard from './NewMetricCard';

const getSeverityBadge = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return { bg: 'danger', icon: <FaExclamationTriangle /> };
    case 'high':
      return { bg: 'warning', icon: <FaExclamationCircle /> };
    case 'medium':
      return { bg: 'info', icon: <FaExclamationCircle /> };
    case 'low':
      return { bg: 'secondary', icon: <FaInfoCircle /> };
    default:
      return { bg: 'secondary', icon: <FaInfoCircle /> };
  }
};

const getStageIcon = (stage) => {
  switch (stage?.toLowerCase()) {
    case 'code':
      return <FaCode />;
    case 'build':
      return <FaDocker />;
    case 'runtime':
      return <FaCloudversify />;
    default:
      return <FaShieldAlt />;
  }
};

const SecurityFindings = ({ securityData }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedService, setSelectedService] = useState(null);
  
  if (!securityData || !securityData.summary) {
    return (
      <Alert variant="info">
        No security findings data available. Run the security analysis to generate findings.
      </Alert>
    );
  }
  
  const { summary, services } = securityData;
  
  // Prepare metrics for summary cards
  const metrics = [
    { 
      value: summary.total_findings || 0, 
      label: "Total Findings", 
      icon: <FaShieldAlt />, 
      color: "#6c757d" 
    },
    { 
      value: summary.critical || 0, 
      label: "Critical", 
      icon: <FaExclamationTriangle />, 
      color: "#dc3545" 
    },
    { 
      value: summary.high || 0, 
      label: "High", 
      icon: <FaExclamationCircle />, 
      color: "#fd7e14" 
    },
    { 
      value: summary.medium || 0, 
      label: "Medium", 
      icon: <FaExclamationCircle />, 
      color: "#0dcaf0" 
    },
    { 
      value: summary.low || 0, 
      label: "Low", 
      icon: <FaInfoCircle />, 
      color: "#6c757d" 
    }
  ];
  
  // Calculate percentages for progress bars
  const totalFindings = summary.total_findings || 0;
  const criticalPercent = totalFindings > 0 ? (summary.critical / totalFindings) * 100 : 0;
  const highPercent = totalFindings > 0 ? (summary.high / totalFindings) * 100 : 0;
  const mediumPercent = totalFindings > 0 ? (summary.medium / totalFindings) * 100 : 0;
  const lowPercent = totalFindings > 0 ? (summary.low / totalFindings) * 100 : 0;
  
  // Prepare data for findings by type chart
  const findingsByType = Object.entries(summary.by_type || {}).map(([type, count]) => ({
    type,
    count
  })).sort((a, b) => b.count - a.count);
  
  // Prepare data for findings by service chart
  const findingsByService = Object.entries(summary.by_service || {}).map(([service, count]) => ({
    service,
    count
  })).sort((a, b) => b.count - a.count);
  
  // Prepare data for findings by stage
  const findingsByStage = Object.entries(summary.by_stage || {}).map(([stage, count]) => ({
    stage,
    count
  }));
  
  // Get all findings across all services
  const allFindings = services.flatMap(service => 
    service.findings.map(finding => ({
      ...finding,
      service_name: service.name
    }))
  );
  
  // Filter findings by service if selected
  const filteredFindings = selectedService 
    ? allFindings.filter(finding => finding.service_name === selectedService)
    : allFindings;
  
  return (
    <div className="security-findings mb-4">
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-danger text-white">
          <h5 className="mb-0">Security Findings</h5>
        </Card.Header>
        <Card.Body className="bg-light">
          <Row>
            {metrics.map((metric, index) => (
              <Col xs={12} sm={6} md={metrics.length === 5 ? 2 : 2} key={index} className="d-flex">
                <NewMetricCard 
                  value={metric.value} 
                  label={metric.label} 
                  icon={metric.icon} 
                  color={metric.color}
                />
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
      
      <Card className="border-0 shadow-sm">
        <Card.Header>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="summary" title="Summary">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h5>Findings by Severity</h5>
                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Critical</span>
                        <span>{summary.critical || 0} ({criticalPercent.toFixed(1)}%)</span>
                      </div>
                      <ProgressBar variant="danger" now={criticalPercent} className="mb-3" />
                      
                      <div className="d-flex justify-content-between mb-1">
                        <span>High</span>
                        <span>{summary.high || 0} ({highPercent.toFixed(1)}%)</span>
                      </div>
                      <ProgressBar variant="warning" now={highPercent} className="mb-3" />
                      
                      <div className="d-flex justify-content-between mb-1">
                        <span>Medium</span>
                        <span>{summary.medium || 0} ({mediumPercent.toFixed(1)}%)</span>
                      </div>
                      <ProgressBar variant="info" now={mediumPercent} className="mb-3" />
                      
                      <div className="d-flex justify-content-between mb-1">
                        <span>Low</span>
                        <span>{summary.low || 0} ({lowPercent.toFixed(1)}%)</span>
                      </div>
                      <ProgressBar variant="secondary" now={lowPercent} className="mb-3" />
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <h5>Findings by Type</h5>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Count</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {findingsByType.map((item, index) => (
                          <tr key={index}>
                            <td>{item.type}</td>
                            <td>{item.count}</td>
                            <td>{totalFindings > 0 ? ((item.count / totalFindings) * 100).toFixed(1) : 0}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                
                <Row className="mt-4">
                  <Col md={6}>
                    <h5>Findings by Service</h5>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Service</th>
                          <th>Count</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {findingsByService.map((item, index) => (
                          <tr key={index}>
                            <td>{item.service}</td>
                            <td>{item.count}</td>
                            <td>{totalFindings > 0 ? ((item.count / totalFindings) * 100).toFixed(1) : 0}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                  
                  <Col md={6}>
                    <h5>Findings by Stage</h5>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Stage</th>
                          <th>Count</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {findingsByStage.map((item, index) => (
                          <tr key={index}>
                            <td>{item.stage.charAt(0).toUpperCase() + item.stage.slice(1)}</td>
                            <td>{item.count}</td>
                            <td>{totalFindings > 0 ? ((item.count / totalFindings) * 100).toFixed(1) : 0}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Card.Body>
            </Tab>
            
            <Tab eventKey="findings" title="All Findings">
              <Card.Body>
                <div className="mb-3">
                  <label htmlFor="serviceFilter" className="form-label">Filter by Service:</label>
                  <select 
                    id="serviceFilter" 
                    className="form-select" 
                    value={selectedService || ''} 
                    onChange={(e) => setSelectedService(e.target.value || null)}
                  >
                    <option value="">All Services</option>
                    {services.map((service, index) => (
                      <option key={index} value={service.name}>{service.name}</option>
                    ))}
                  </select>
                </div>
                
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Stage</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Severity</th>
                      <th>Source</th>
                      <th>Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFindings.map((finding, index) => {
                      const { bg, icon } = getSeverityBadge(finding.severity);
                      return (
                        <tr key={index}>
                          <td>{finding.service_name}</td>
                          <td>
                            <span className="me-1">{getStageIcon(finding.stage)}</span>
                            {finding.stage.charAt(0).toUpperCase() + finding.stage.slice(1)}
                          </td>
                          <td>{finding.type}</td>
                          <td>{finding.description}</td>
                          <td>
                            <Badge bg={bg} className="d-flex align-items-center">
                              <span className="me-1">{icon}</span>
                              {finding.severity}
                            </Badge>
                          </td>
                          <td>{finding.source}</td>
                          <td>{finding.owner}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Tab>
            
            <Tab eventKey="connected" title="Connected Findings">
              <Card.Body>
                <Alert variant="info">
                  Connected findings show vulnerabilities that span across the development pipeline, 
                  from code to build to runtime environments.
                </Alert>
                
                {services?.flatMap(service => 
                  service.connected_findings.map((chain, chainIndex) => (
                    <div key={`${service.name}-${chainIndex}`}>
                      <PipelineView pipeline={chain} />
                      <Card className="mb-4">
                        <Card.Header>
                          <h6 className="mb-0">Connected Findings Details</h6>
                        </Card.Header>
                        <Card.Body>
                          <Table striped bordered hover size="sm">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Stage</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Vulnerable Package</th>
                                <th>Severity</th>
                              </tr>
                            </thead>
                            <tbody>
                              {chain.findings.map(findingId => {
                                const finding = allFindings.find(f => f.id === findingId);
                                if (!finding) return null;
                                
                                const badgeInfo = getSeverityBadge(finding.severity);
                                return (
                                  <tr key={findingId}>
                                    <td>{findingId}</td>
                                    <td>
                                      <span className="me-1">{getStageIcon(finding.stage)}</span>
                                      {finding.stage.charAt(0).toUpperCase() + finding.stage.slice(1)}
                                    </td>
                                    <td>{finding.type}</td>
                                    <td>{finding.description}</td>
                                    <td>
                                      {finding.vulnerable_package ? (
                                        <div>
                                          <code>{finding.vulnerable_package.name}</code>
                                          <br />
                                          <small className="text-muted">
                                            {finding.vulnerable_package.version} → {finding.vulnerable_package.fixed_version}
                                          </small>
                                        </div>
                                      ) : '-'}
                                    </td>
                                    <td>
                                      <Badge 
                                        bg={badgeInfo}
                                        style={{
                                          color: badgeInfo === 'warning' ? '#000' : '#fff',
                                          textShadow: badgeInfo === 'warning' ? 'none' : '0 0 10px rgba(0,0,0,0.5)'
                                        }}
                                      >
                                        {finding.severity}
                                      </Badge>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </div>
                  ))
                ) || <Alert variant="info">No connected findings available.</Alert>};
              </Card.Body>
            </Tab>
          </Tabs>
        </Card.Header>
      </Card>
    </div>
  );
};

export default SecurityFindings;
