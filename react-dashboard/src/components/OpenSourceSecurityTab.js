import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, InputGroup, Row, Col, ProgressBar, Nav, Tab, Button, Spinner, Alert, Modal, Accordion } from 'react-bootstrap';
import { FaSearch, FaExclamationTriangle, FaShieldAlt, FaCheckCircle, FaInfoCircle, FaGithub, FaBox, FaTag, FaFileAlt, FaDocker, FaExclamationCircle, FaWrench, FaHourglass, FaTimesCircle } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './OpenSourceSecurityTab.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const OpenSourceSecurityTab = ({ opensourceData, dependencies }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterFixed, setFilterFixed] = useState('all');
  
  // If opensourceData is not available, use dependencies data as fallback
  const hasOpensourceData = opensourceData && opensourceData.summary;
  
  // Extract data from opensourceData or use fallbacks
  const summary = hasOpensourceData ? opensourceData.summary : {
    total_packages: dependencies?.total_count || 0,
    vulnerable_packages: dependencies?.vulnerable_count || 0,
    outdated_packages: dependencies?.outdated_count || 0,
    total_images: 0,
    vulnerable_images: 0,
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      total: 0
    },
    vulnerability_types: {},
    license_distribution: dependencies?.license_distribution || {},
    remediation_progress: {
      fixed: 0,
      in_progress: 0,
      not_started: 0
    }
  };
  
  const packages = hasOpensourceData ? opensourceData.packages : (dependencies?.dependencies || []);
  const images = hasOpensourceData ? opensourceData.images : [];
  
  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Search in packages
    const packageResults = packages.filter(pkg => 
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pkg.language && pkg.language.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pkg.license && pkg.license.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    // Search in images
    const imageResults = images.filter(img => 
      img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults({
      packages: packageResults.slice(0, 10),
      images: imageResults.slice(0, 10)
    });
    
    setIsSearching(false);
  }, [searchQuery, packages, images]);
  
  // Filter vulnerabilities
  const filterVulnerabilities = (vulnerabilities) => {
    if (!vulnerabilities) return [];
    
    return vulnerabilities.filter(vuln => {
      // Filter by severity
      if (filterSeverity !== 'all' && vuln.severity.toLowerCase() !== filterSeverity.toLowerCase()) {
        return false;
      }
      
      // Filter by type (based on title)
      if (filterType !== 'all') {
        const vulnType = vuln.title.split(' in ')[0];
        if (!vulnType.toLowerCase().includes(filterType.toLowerCase())) {
          return false;
        }
      }
      
      // Filter by fixed status
      if (filterFixed === 'fixed' && !vuln.fixed_version) {
        return false;
      } else if (filterFixed === 'not-fixed' && vuln.fixed_version) {
        return false;
      }
      
      return true;
    });
  };
  
  // Get severity badge
  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return <Badge bg="danger"><FaExclamationTriangle className="me-1" /> Critical</Badge>;
      case 'high':
        return <Badge bg="warning" text="dark"><FaExclamationCircle className="me-1" /> High</Badge>;
      case 'medium':
        return <Badge bg="primary"><FaInfoCircle className="me-1" /> Medium</Badge>;
      case 'low':
        return <Badge bg="secondary"><FaInfoCircle className="me-1" /> Low</Badge>;
      default:
        return <Badge bg="secondary"><FaInfoCircle className="me-1" /> Unknown</Badge>;
    }
  };
  
  // Get remediation status badge
  const getRemediationBadge = (status) => {
    switch (status) {
      case 'fixed':
        return <Badge bg="success"><FaCheckCircle className="me-1" /> Fixed</Badge>;
      case 'in_progress':
        return <Badge bg="warning" text="dark"><FaHourglass className="me-1" /> In Progress</Badge>;
      case 'not_started':
        return <Badge bg="danger"><FaTimesCircle className="me-1" /> Not Started</Badge>;
      default:
        return <Badge bg="secondary"><FaInfoCircle className="me-1" /> Unknown</Badge>;
    }
  };
  
  // Prepare chart data for vulnerabilities by severity
  const severityChartData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        data: [
          summary.vulnerabilities.critical,
          summary.vulnerabilities.high,
          summary.vulnerabilities.medium,
          summary.vulnerabilities.low
        ],
        backgroundColor: [
          '#dc3545', // danger
          '#ffc107', // warning
          '#0d6efd', // primary
          '#6c757d'  // secondary
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Prepare chart data for remediation progress
  const remediationChartData = {
    labels: ['Fixed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [
          summary.remediation_progress.fixed,
          summary.remediation_progress.in_progress,
          summary.remediation_progress.not_started
        ],
        backgroundColor: [
          '#198754', // success
          '#ffc107', // warning
          '#dc3545'  // danger
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Prepare chart data for vulnerability types
  const vulnerabilityTypesData = {
    labels: Object.keys(summary.vulnerability_types).slice(0, 10),
    datasets: [
      {
        label: 'Vulnerabilities by Type',
        data: Object.values(summary.vulnerability_types).slice(0, 10),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };
  
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  // If no data is available
  if (!hasOpensourceData && (!dependencies || !dependencies.dependencies)) {
    return (
      <Alert variant="info">
        No open source security data available. Run the analysis to generate data.
      </Alert>
    );
  }
  
  // Render the overview tab
  const renderOverview = () => (
    <div className="overview-tab">
      <Row className="mb-4">
        <Col md={6} lg={3}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-icon bg-primary">
                <FaBox />
              </div>
              <div className="metric-content">
                <h3>{summary.total_packages}</h3>
                <p>Total Packages</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-icon bg-warning">
                <FaExclamationTriangle />
              </div>
              <div className="metric-content">
                <h3>{summary.vulnerable_packages}</h3>
                <p>Vulnerable Packages</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-icon bg-info">
                <FaDocker />
              </div>
              <div className="metric-content">
                <h3>{summary.total_images}</h3>
                <p>Container Images</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-icon bg-danger">
                <FaShieldAlt />
              </div>
              <div className="metric-content">
                <h3>{summary.vulnerabilities.total}</h3>
                <p>Total Vulnerabilities</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>Vulnerabilities by Severity</Card.Header>
            <Card.Body>
              <div style={{ height: '250px' }}>
                <Pie data={severityChartData} options={chartOptions} />
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Critical</span>
                  <span>{summary.vulnerabilities.critical}</span>
                </div>
                <ProgressBar variant="danger" now={summary.vulnerabilities.critical / summary.vulnerabilities.total * 100} className="mb-2" />
                
                <div className="d-flex justify-content-between mb-1">
                  <span>High</span>
                  <span>{summary.vulnerabilities.high}</span>
                </div>
                <ProgressBar variant="warning" now={summary.vulnerabilities.high / summary.vulnerabilities.total * 100} className="mb-2" />
                
                <div className="d-flex justify-content-between mb-1">
                  <span>Medium</span>
                  <span>{summary.vulnerabilities.medium}</span>
                </div>
                <ProgressBar variant="primary" now={summary.vulnerabilities.medium / summary.vulnerabilities.total * 100} className="mb-2" />
                
                <div className="d-flex justify-content-between mb-1">
                  <span>Low</span>
                  <span>{summary.vulnerabilities.low}</span>
                </div>
                <ProgressBar variant="secondary" now={summary.vulnerabilities.low / summary.vulnerabilities.total * 100} className="mb-2" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>Remediation Progress</Card.Header>
            <Card.Body>
              <div style={{ height: '250px' }}>
                <Pie data={remediationChartData} options={chartOptions} />
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Fixed</span>
                  <span>{summary.remediation_progress.fixed}</span>
                </div>
                <ProgressBar variant="success" now={summary.remediation_progress.fixed / summary.vulnerabilities.total * 100} className="mb-2" />
                
                <div className="d-flex justify-content-between mb-1">
                  <span>In Progress</span>
                  <span>{summary.remediation_progress.in_progress}</span>
                </div>
                <ProgressBar variant="warning" now={summary.remediation_progress.in_progress / summary.vulnerabilities.total * 100} className="mb-2" />
                
                <div className="d-flex justify-content-between mb-1">
                  <span>Not Started</span>
                  <span>{summary.remediation_progress.not_started}</span>
                </div>
                <ProgressBar variant="danger" now={summary.remediation_progress.not_started / summary.vulnerabilities.total * 100} className="mb-2" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>Top Vulnerability Types</Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Bar data={vulnerabilityTypesData} options={barChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
  // Render the packages tab
  const renderPackages = () => (
    <div className="packages-tab">
      <div className="mb-3">
        <Form>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Severity</Form.Label>
                <Form.Select 
                  value={filterSeverity} 
                  onChange={(e) => setFilterSeverity(e.target.value)}
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Type</Form.Label>
                <Form.Select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  {Object.keys(summary.vulnerability_types || {}).map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Fix Status</Form.Label>
                <Form.Select 
                  value={filterFixed} 
                  onChange={(e) => setFilterFixed(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="fixed">Fixed Available</option>
                  <option value="not-fixed">No Fix Available</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Package</th>
            <th>Version</th>
            <th>Language</th>
            <th>Vulnerabilities</th>
            <th>License</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.filter(pkg => pkg.is_vulnerable || (pkg.vulnerabilities && pkg.vulnerabilities.length > 0)).map((pkg, index) => {
            const vulnerabilities = filterVulnerabilities(pkg.vulnerabilities || []);
            if (vulnerabilities.length === 0 && filterSeverity !== 'all') return null;
            
            return (
              <tr key={index}>
                <td>{pkg.name}</td>
                <td>
                  {pkg.version}
                  {pkg.latest_version && pkg.version !== pkg.latest_version && (
                    <span className="text-danger ms-2">
                      <FaExclamationCircle /> Outdated
                    </span>
                  )}
                </td>
                <td>{pkg.language}</td>
                <td>
                  {vulnerabilities.length > 0 ? (
                    <div>
                      {vulnerabilities.slice(0, 3).map((vuln, i) => (
                        <div key={i} className="mb-1">
                          {getSeverityBadge(vuln.severity)} {vuln.id || vuln.title}
                        </div>
                      ))}
                      {vulnerabilities.length > 3 && (
                        <div className="text-muted">+{vulnerabilities.length - 3} more</div>
                      )}
                    </div>
                  ) : (
                    <Badge bg="success">No vulnerabilities</Badge>
                  )}
                </td>
                <td>
                  {pkg.license}
                  {pkg.license_compliance === "Non-Compliant" && (
                    <Badge bg="danger" className="ms-2">Non-Compliant</Badge>
                  )}
                  {pkg.license_compliance === "Review Needed" && (
                    <Badge bg="warning" text="dark" className="ms-2">Review Needed</Badge>
                  )}
                </td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      
      {selectedPackage && (
        <Modal show={!!selectedPackage} onHide={() => setSelectedPackage(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedPackage.name} v{selectedPackage.version}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3">
              <Col md={6}>
                <strong>Language:</strong> {selectedPackage.language}
              </Col>
              <Col md={6}>
                <strong>Package Manager:</strong> {selectedPackage.package_manager}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <strong>Current Version:</strong> {selectedPackage.version}
              </Col>
              <Col md={6}>
                <strong>Latest Version:</strong> {selectedPackage.latest_version || 'Unknown'}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <strong>License:</strong> {selectedPackage.license}
              </Col>
              <Col md={6}>
                <strong>License Compliance:</strong> {selectedPackage.license_compliance || 'Unknown'}
              </Col>
            </Row>
            
            <h5>Vulnerabilities</h5>
            {selectedPackage.vulnerabilities && selectedPackage.vulnerabilities.length > 0 ? (
              <Accordion defaultActiveKey="0">
                {selectedPackage.vulnerabilities.map((vuln, index) => (
                  <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>
                      {getSeverityBadge(vuln.severity)} {vuln.id || ''} - {vuln.title}
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>{vuln.description}</p>
                      <Row>
                        <Col md={6}>
                          <strong>CVSS Score:</strong> {vuln.cvss_score}
                        </Col>
                        <Col md={6}>
                          <strong>Published:</strong> {vuln.published_date}
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col md={6}>
                          <strong>Affected Versions:</strong> {vuln.affected_versions}
                        </Col>
                        <Col md={6}>
                          <strong>Fixed Version:</strong> {vuln.fixed_version || 'Not available'}
                        </Col>
                      </Row>
                      <div className="mt-2">
                        <strong>Remediation:</strong> {vuln.remediation}
                      </div>
                      {vuln.references && vuln.references.length > 0 && (
                        <div className="mt-2">
                          <strong>References:</strong>
                          <ul>
                            {vuln.references.map((ref, i) => (
                              <li key={i}>
                                <a href={ref} target="_blank" rel="noopener noreferrer">{ref}</a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            ) : (
              <Alert variant="success">No vulnerabilities found</Alert>
            )}
            
            <h5 className="mt-3">Usage</h5>
            {selectedPackage.usage && selectedPackage.usage.length > 0 ? (
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>File</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPackage.usage.map((usage, index) => (
                    <tr key={index}>
                      <td>{usage.service}</td>
                      <td>{usage.file}</td>
                      <td>{usage.type}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert variant="info">No usage information available</Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedPackage(null)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
  // Render the images tab
  const renderImages = () => (
    <div className="images-tab">
      <div className="mb-3">
        <Form>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Severity</Form.Label>
                <Form.Select 
                  value={filterSeverity} 
                  onChange={(e) => setFilterSeverity(e.target.value)}
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Type</Form.Label>
                <Form.Select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  {Object.keys(summary.vulnerability_types || {}).map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Fix Status</Form.Label>
                <Form.Select 
                  value={filterFixed} 
                  onChange={(e) => setFilterFixed(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="fixed">Fixed Available</option>
                  <option value="not-fixed">No Fix Available</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Size</th>
            <th>Vulnerabilities</th>
            <th>Security Score</th>
            <th>Used By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {images.filter(img => img.vulnerabilities && img.vulnerabilities.length > 0).map((img, index) => {
            const vulnerabilities = filterVulnerabilities(img.vulnerabilities || []);
            if (vulnerabilities.length === 0 && filterSeverity !== 'all') return null;
            
            return (
              <tr key={index}>
                <td>
                  <FaDocker className="me-2 text-primary" />
                  {img.full_name}
                </td>
                <td>{img.size}</td>
                <td>
                  {img.vulnerability_counts && (
                    <>
                      {img.vulnerability_counts.critical > 0 && (
                        <Badge bg="danger" className="me-1">
                          {img.vulnerability_counts.critical} Critical
                        </Badge>
                      )}
                      {img.vulnerability_counts.high > 0 && (
                        <Badge bg="warning" text="dark" className="me-1">
                          {img.vulnerability_counts.high} High
                        </Badge>
                      )}
                      {img.vulnerability_counts.medium > 0 && (
                        <Badge bg="primary" className="me-1">
                          {img.vulnerability_counts.medium} Medium
                        </Badge>
                      )}
                      {img.vulnerability_counts.low > 0 && (
                        <Badge bg="secondary" className="me-1">
                          {img.vulnerability_counts.low} Low
                        </Badge>
                      )}
                    </>
                  )}
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <ProgressBar 
                      now={img.security_score} 
                      variant={
                        img.security_score >= 80 ? 'success' :
                        img.security_score >= 60 ? 'warning' :
                        'danger'
                      }
                      style={{ width: '100px', height: '10px' }}
                      className="me-2"
                    />
                    <span>{img.security_score}</span>
                  </div>
                </td>
                <td>
                  {img.used_by && img.used_by.map((service, i) => (
                    <Badge bg="info" key={i} className="me-1">{service}</Badge>
                  ))}
                </td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => setSelectedImage(img)}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      
      {selectedImage && (
        <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <FaDocker className="me-2 text-primary" />
              {selectedImage.full_name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3">
              <Col md={4}>
                <strong>Size:</strong> {selectedImage.size}
              </Col>
              <Col md={4}>
                <strong>Layers:</strong> {selectedImage.layers}
              </Col>
              <Col md={4}>
                <strong>Created:</strong> {selectedImage.created}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <strong>Registry:</strong> {selectedImage.registry}
              </Col>
              <Col md={6}>
                <strong>Scan Date:</strong> {selectedImage.scan_date}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <strong>Security Score:</strong>
                <div className="d-flex align-items-center mt-1">
                  <ProgressBar 
                    now={selectedImage.security_score} 
                    variant={
                      selectedImage.security_score >= 80 ? 'success' :
                      selectedImage.security_score >= 60 ? 'warning' :
                      'danger'
                    }
                    style={{ width: '100%', height: '20px' }}
                    className="me-2"
                  />
                  <span className="ms-2">{selectedImage.security_score}</span>
                </div>
              </Col>
            </Row>
            
            <h5>Vulnerabilities</h5>
            {selectedImage.vulnerabilities && selectedImage.vulnerabilities.length > 0 ? (
              <Accordion defaultActiveKey="0">
                {selectedImage.vulnerabilities.map((vuln, index) => (
                  <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>
                      {getSeverityBadge(vuln.severity)} {vuln.id || ''} - {vuln.title}
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>{vuln.description}</p>
                      <Row>
                        <Col md={6}>
                          <strong>CVSS Score:</strong> {vuln.cvss_score}
                        </Col>
                        <Col md={6}>
                          <strong>Published:</strong> {vuln.published_date}
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col md={6}>
                          <strong>Component:</strong> {vuln.component} {vuln.component_version}
                        </Col>
                        <Col md={6}>
                          <strong>Fixed Version:</strong> {vuln.fixed_version || 'Not available'}
                        </Col>
                      </Row>
                      <div className="mt-2">
                        <strong>Layer ID:</strong> {vuln.layer_id}
                      </div>
                      <div className="mt-2">
                        <strong>Remediation:</strong> {vuln.remediation}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            ) : (
              <Alert variant="success">No vulnerabilities found</Alert>
            )}
            
            <h5 className="mt-3">Used By</h5>
            {selectedImage.used_by && selectedImage.used_by.length > 0 ? (
              <div>
                {selectedImage.used_by.map((service, index) => (
                  <Badge bg="info" key={index} className="me-2 mb-2">{service}</Badge>
                ))}
              </div>
            ) : (
              <Alert variant="info">No usage information available</Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedImage(null)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
  // Render the search tab
  const renderSearch = () => (
    <div className="search-tab">
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          placeholder="Search for packages, libraries, or images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isSearching && (
          <InputGroup.Text>
            <Spinner animation="border" size="sm" />
          </InputGroup.Text>
        )}
      </InputGroup>
      
      {searchQuery && searchResults && (
        <div className="search-results">
          {searchResults.packages && searchResults.packages.length > 0 && (
            <>
              <h5>Packages</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Version</th>
                    <th>Language</th>
                    <th>Vulnerabilities</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.packages.map((pkg, index) => (
                    <tr key={index}>
                      <td>{pkg.name}</td>
                      <td>{pkg.version}</td>
                      <td>{pkg.language}</td>
                      <td>
                        {pkg.vulnerabilities && pkg.vulnerabilities.length > 0 ? (
                          <Badge bg="danger">{pkg.vulnerabilities.length} vulnerabilities</Badge>
                        ) : (
                          <Badge bg="success">No vulnerabilities</Badge>
                        )}
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
          
          {searchResults.images && searchResults.images.length > 0 && (
            <>
              <h5>Images</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Vulnerabilities</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.images.map((img, index) => (
                    <tr key={index}>
                      <td>
                        <FaDocker className="me-2 text-primary" />
                        {img.full_name}
                      </td>
                      <td>{img.size}</td>
                      <td>
                        {img.vulnerability_counts && img.vulnerability_counts.total > 0 ? (
                          <Badge bg="danger">{img.vulnerability_counts.total} vulnerabilities</Badge>
                        ) : (
                          <Badge bg="success">No vulnerabilities</Badge>
                        )}
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => setSelectedImage(img)}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
          
          {(!searchResults.packages || searchResults.packages.length === 0) && 
           (!searchResults.images || searchResults.images.length === 0) && (
            <Alert variant="info">
              No results found for "{searchQuery}"
            </Alert>
          )}
        </div>
      )}
    </div>
  );
  
  return (
    <div className="opensource-security-tab">
      <Card className="mb-4">
        <Card.Header>
          <h4>Open Source Security</h4>
        </Card.Header>
        <Card.Body>
          <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="overview">
                <FaShieldAlt className="me-1" /> Overview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="packages">
                <FaBox className="me-1" /> Packages
                {summary.vulnerable_packages > 0 && (
                  <Badge bg="danger" pill className="ms-1">
                    {summary.vulnerable_packages}
                  </Badge>
                )}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="images">
                <FaDocker className="me-1" /> Images
                {summary.vulnerable_images > 0 && (
                  <Badge bg="danger" pill className="ms-1">
                    {summary.vulnerable_images}
                  </Badge>
                )}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="search">
                <FaSearch className="me-1" /> Search
              </Nav.Link>
            </Nav.Item>
          </Nav>
          
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'packages' && renderPackages()}
          {activeTab === 'images' && renderImages()}
          {activeTab === 'search' && renderSearch()}
        </Card.Body>
      </Card>
    </div>
  );
};

export default OpenSourceSecurityTab;
