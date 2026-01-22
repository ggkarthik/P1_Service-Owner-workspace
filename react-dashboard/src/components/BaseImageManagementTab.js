import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Row, Col, Tabs, Tab, ProgressBar, Button, Modal, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaDocker, FaExclamationTriangle, FaInfoCircle, FaShieldAlt, FaClock, FaLayerGroup, FaCheck, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';
import './BaseImageManagementTab.css';

// Safe stringify function to handle any value
const safeStringify = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return String(value);
    }
  }
  return String(value);
};

const BaseImageManagementTab = ({ baseImageInsights, images }) => {
  const [baseImages, setBaseImages] = useState([]);
  const [summary, setSummary] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Process the data from props or fetch it
    const processData = () => {
      // Convert baseImageInsights to a format compatible with the component
      if (baseImageInsights) {
        // If baseImageInsights is an object with key-value pairs where keys are image names
        // and values are image details, convert it to an array of image objects
        if (typeof baseImageInsights === 'object' && !Array.isArray(baseImageInsights) && !baseImageInsights.base_images) {
          const processedImages = Object.entries(baseImageInsights).map(([name, details]) => {
            const [imageName, tag] = name.split(':');
            return {
              name: imageName,
              tag: tag || 'latest',
              full_name: name,
              vulnerabilities: details.vulnerabilities || [],
              vulnerability_counts: {
                critical: details.vulnerabilities?.filter(v => v.severity === 'Critical').length || 0,
                high: details.vulnerabilities?.filter(v => v.severity === 'High').length || 0,
                medium: details.vulnerabilities?.filter(v => v.severity === 'Medium').length || 0,
                low: details.vulnerabilities?.filter(v => v.severity === 'Low').length || 0,
                total: details.vulnerabilities?.length || 0
              },
              registry: 'docker.io',
              size: '100MB', // Default size
              layers: 5, // Default layers
              last_updated: new Date().toISOString().split('T')[0],
              used_by: images?.filter(img => img.baseImage === name).map(img => img.name) || []
            };
          });
          setBaseImages(processedImages);
          setSummary({
            total_images: processedImages.length,
            vulnerable_images: processedImages.filter(img => img.vulnerability_counts.total > 0).length,
            vulnerabilities: {
              critical: processedImages.reduce((acc, img) => acc + img.vulnerability_counts.critical, 0),
              high: processedImages.reduce((acc, img) => acc + img.vulnerability_counts.high, 0),
              medium: processedImages.reduce((acc, img) => acc + img.vulnerability_counts.medium, 0),
              low: processedImages.reduce((acc, img) => acc + img.vulnerability_counts.low, 0),
              total: processedImages.reduce((acc, img) => acc + img.vulnerability_counts.total, 0)
            }
          });
        } else if (baseImageInsights.base_images) {
          // If baseImageInsights has a base_images property, use it directly
          setBaseImages(baseImageInsights.base_images);
          setSummary(baseImageInsights.summary || {});
        } else {
          // Fallback to empty arrays
          setBaseImages([]);
          setSummary({});
        }
      } else {
        // Fallback to fetching from the API
        fetch('/data/base_images_data.json')
          .then(response => response.json())
          .then(data => {
            if (data.base_images) {
              setBaseImages(data.base_images);
              setSummary(data.summary || {});
            } else if (data.baseImageInsights) {
              // Process the data in the same way as above
              processData();
            } else {
              setBaseImages([]);
              setSummary({});
            }
          })
          .catch(error => {
            console.error('Error loading base image data:', error);
            setBaseImages([]);
            setSummary({});
          });
      }
    };
    
    processData();
    setLoading(false);
  }, [baseImageInsights, images]);

  const getSeverityVariant = (severity) => {
    switch (severity) {
      case 'Critical': return 'danger';
      case 'High': return 'warning';
      case 'Medium': return 'primary';
      case 'Low': return 'info';
      default: return 'secondary';
    }
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const ImageDetailsModal = ({ image, show, onHide }) => {
    if (!image) return null;

    // Format date for display
    const formatDate = (dateStr) => {
      if (!dateStr) return 'Unknown';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    // Calculate days since update
    const getDaysSinceUpdate = (dateStr) => {
      if (!dateStr) return 'Unknown';
      const updateDate = new Date(dateStr);
      const now = new Date();
      const diffTime = Math.abs(now - updateDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const daysSinceUpdate = getDaysSinceUpdate(image.last_updated);

    return (
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaDocker className="me-2" /> 
            {safeStringify(image.name)}:{safeStringify(image.tag)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="overview" className="mb-3">
            <Tab eventKey="overview" title="Overview">
              <Row>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header>Image Details</Card.Header>
                    <Card.Body>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <strong>Full Name:</strong> {safeStringify(image.full_name) || `${safeStringify(image.registry || 'docker.io')}/${safeStringify(image.name)}:${safeStringify(image.tag || 'latest')}`}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Digest:</strong> <span className="text-monospace small">{safeStringify(image.digest) || 'Not available'}</span>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>OS:</strong> {safeStringify(image.os || 'Linux')} {safeStringify(image.os_version || '')}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Size:</strong> {safeStringify(image.size || '0MB')}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Layers:</strong> {safeStringify(image.layers || 0)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Last Updated:</strong> {formatDate(image.last_updated || new Date().toISOString())}
                          <Badge 
                            bg={daysSinceUpdate > 90 ? 'danger' : daysSinceUpdate > 30 ? 'warning' : 'success'}
                            className="ms-2"
                          >
                            {safeStringify(daysSinceUpdate || 0)} days ago
                          </Badge>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header>Usage</Card.Header>
                    <Card.Body>
                      <strong>Used by {image.used_by?.length || 0} services:</strong>
                      <ListGroup className="mt-2">
                        {(image.used_by || []).map((service, index) => (
                          <ListGroup.Item key={index}>
                            {service}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card>
                <Card.Header>Security Summary</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4} className="text-center mb-3">
                      <h4>{safeStringify(image.vulnerability_counts?.total || 0)}</h4>
                      <p className="text-muted">Total Vulnerabilities</p>
                    </Col>
                    <Col md={4} className="text-center mb-3">
                      <h4 className="text-danger">{safeStringify((image.vulnerability_counts?.critical || 0) + (image.vulnerability_counts?.high || 0))}</h4>
                      <p className="text-muted">Critical/High</p>
                    </Col>
                    <Col md={4} className="text-center mb-3">
                      <h4 className="text-success">{safeStringify((image.vulnerabilities || []).filter(v => v.fixed_version).length || 0)}</h4>
                      <p className="text-muted">Fixes Available</p>
                    </Col>
                  </Row>
                  
                  {(image.vulnerability_counts?.total || 0) > 0 && (
                    <div className="mt-3">
                      <h6>Vulnerability Distribution</h6>
                      <div className="d-flex align-items-center mb-2">
                        <span className="vulnerability-label">Critical</span>
                        <ProgressBar 
                          variant="danger" 
                          now={image.vulnerability_counts?.critical || 0} 
                          max={image.vulnerability_counts?.total || 1}
                          className="flex-grow-1 mx-2"
                        />
                        <span className="vulnerability-count">{safeStringify(image.vulnerability_counts?.critical || 0)}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <span className="vulnerability-label">High</span>
                        <ProgressBar 
                          variant="warning" 
                          now={image.vulnerability_counts?.high || 0} 
                          max={image.vulnerability_counts?.total || 1}
                          className="flex-grow-1 mx-2"
                        />
                        <span className="vulnerability-count">{safeStringify(image.vulnerability_counts?.high || 0)}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <span className="vulnerability-label">Medium</span>
                        <ProgressBar 
                          variant="primary" 
                          now={image.vulnerability_counts?.medium || 0} 
                          max={image.vulnerability_counts?.total || 1}
                          className="flex-grow-1 mx-2"
                        />
                        <span className="vulnerability-count">{safeStringify(image.vulnerability_counts?.medium || 0)}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="vulnerability-label">Low</span>
                        <ProgressBar 
                          variant="info" 
                          now={image.vulnerability_counts?.low || 0} 
                          max={image.vulnerability_counts?.total || 1}
                          className="flex-grow-1 mx-2"
                        />
                        <span className="vulnerability-count">{safeStringify(image.vulnerability_counts?.low || 0)}</span>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="vulnerabilities" title="Vulnerabilities">
              {!image.vulnerabilities || image.vulnerabilities.length === 0 ? (
                <div className="text-center p-4">
                  <FaShieldAlt className="text-success mb-3" size={40} />
                  <h5>No vulnerabilities detected!</h5>
                  <p className="text-muted">This image appears to be secure based on current scans.</p>
                </div>
              ) : (
                <div>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Severity</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>CVE</th>
                        <th>Remediation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {image.vulnerabilities.map((finding, index) => (
                        <tr key={index}>
                          <td>
                            <Badge bg={getSeverityVariant(finding.severity)}>
                              {finding.severity}
                            </Badge>
                          </td>
                          <td>{finding.title ? finding.title.split(' in ')[0] : 'Vulnerability'}</td>
                          <td>{finding.description}</td>
                          <td>
                            {finding.id ? (
                              <a 
                                href={`https://nvd.nist.gov/vuln/detail/${finding.id}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                {finding.id} <FaExternalLinkAlt size={12} />
                              </a>
                            ) : (
                              <span className="text-muted">N/A</span>
                            )}
                          </td>
                          <td>{finding.remediation || (finding.fixed_version ? `Upgrade to ${finding.fixed_version}` : 'No remediation available')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Tab>
            <Tab eventKey="recommendations" title="Recommendations">
              <Card className="mb-3">
                <Card.Header>Update Recommendations</Card.Header>
                <Card.Body>
                  {daysSinceUpdate > 90 ? (
                    <div className="alert alert-danger">
                      <FaExclamationTriangle className="me-2" />
                      <strong>High Priority Update Recommended</strong>
                      <p>This image hasn't been updated in over 90 days and may contain security vulnerabilities.</p>
                    </div>
                  ) : daysSinceUpdate > 30 ? (
                    <div className="alert alert-warning">
                      <FaInfoCircle className="me-2" />
                      <strong>Update Recommended</strong>
                      <p>This image is over 30 days old and may need updating soon.</p>
                    </div>
                  ) : (
                    <div className="alert alert-success">
                      <FaCheck className="me-2" />
                      <strong>Image is Up to Date</strong>
                      <p>This image has been updated within the last 30 days.</p>
                    </div>
                  )}

                  {(image.vulnerability_counts?.critical || 0) > 0 && (
                    <div className="alert alert-danger mt-3">
                      <FaExclamationTriangle className="me-2" />
                      <strong>Critical Vulnerabilities Detected</strong>
                      <p>This image has {image.vulnerability_counts?.critical || 0} critical vulnerabilities that should be addressed immediately.</p>
                    </div>
                  )}

                  <h5 className="mt-4">Recommended Actions</h5>
                  <ul className="recommendation-list">
                    {((image.vulnerability_counts?.critical || 0) + (image.vulnerability_counts?.high || 0)) > 0 && (
                      <li>Update to the latest version of this base image</li>
                    )}
                    {daysSinceUpdate > 30 && (
                      <li>Consider using a more frequently updated base image</li>
                    )}
                    <li>Configure automated scanning for this image in your CI/CD pipeline</li>
                    <li>Set up image vulnerability monitoring</li>
                    <li>Implement a regular update schedule for base images</li>
                  </ul>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  if (loading) {
    return <div className="loading">Loading base image data...</div>;
  }

  return (
    <div className="base-image-management-tab">
      <h2 className="mb-4">
        <FaDocker className="me-2" />
        Base Image Management
      </h2>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-stat">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <FaDocker />
              </div>
              <h3>{safeStringify(summary.total_images || 0)}</h3>
              <p>Base Images</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stat">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <FaExclamationTriangle />
              </div>
              <h3>{safeStringify(summary.vulnerabilities?.total || 0)}</h3>
              <p>Vulnerabilities</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stat">
            <Card.Body className="text-center">
              <div className="stat-icon warning">
                <FaShieldAlt />
              </div>
              <h3>{safeStringify(summary.vulnerable_images || 0)}</h3>
              <p>Vulnerable Images</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stat">
            <Card.Body className="text-center">
              <div className="stat-icon info">
                <FaClock />
              </div>
              <h3>{safeStringify(summary.deprecated_images || 0)}</h3>
              <p>Deprecated Images</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Base Images</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover className="base-images-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Registry</th>
                <th>Size</th>
                <th>Used By</th>
                <th>Vulnerabilities</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {baseImages.map((image, index) => {
                const daysSinceUpdate = (() => {
                  if (!image.last_updated) return 0;
                  const updateDate = new Date(image.last_updated);
                  const now = new Date();
                  const diffTime = Math.abs(now - updateDate);
                  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                })();

                return (
                  <tr key={index}>
                    <td>
                      <div className="image-name">
                        <FaDocker className="me-2" />
                        <div>
                          <div>{safeStringify(image.name)}:{safeStringify(image.tag || 'latest')}</div>
                          <small className="text-muted">{safeStringify(image.os || 'Linux')} {safeStringify(image.os_version || '')}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>{image.registry}/{image.repository}</Tooltip>}
                      >
                        <span>{safeStringify(image.registry || 'docker.io')}</span>
                      </OverlayTrigger>
                    </td>
                    <td>{safeStringify(image.size || image.size_mb || '0')} {image.size ? '' : 'MB'}</td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip>
                            {(image.used_by || []).join(', ')}
                          </Tooltip>
                        }
                      >
                        <Badge bg="secondary">{safeStringify(image.used_by?.length || 0)} services</Badge>
                      </OverlayTrigger>
                    </td>
                    <td>
                      {image.vulnerability_counts?.total > 0 ? (
                        <div className="vulnerabilities-cell">
                          <Badge 
                            bg={image.vulnerability_counts.critical > 0 ? 'danger' : image.vulnerability_counts.high > 0 ? 'warning' : 'primary'}
                            className="me-1"
                          >
                            {safeStringify(image.vulnerability_counts?.total || 0)}
                          </Badge>
                          {(image.vulnerability_counts?.critical || 0) > 0 && (
                            <Badge bg="danger" pill className="me-1">{safeStringify(image.vulnerability_counts?.critical || 0)}</Badge>
                          )}
                          {(image.vulnerability_counts?.high || 0) > 0 && (
                            <Badge bg="warning" text="dark" pill>{safeStringify(image.vulnerability_counts?.high || 0)}</Badge>
                          )}
                        </div>
                      ) : (
                        <Badge bg="success">Secure</Badge>
                      )}
                    </td>
                    <td>
                      <Badge 
                        bg={daysSinceUpdate > 90 ? 'danger' : daysSinceUpdate > 30 ? 'warning' : 'success'}
                      >
                        {safeStringify(daysSinceUpdate || 0)} days ago
                      </Badge>
                    </td>
                    <td>
                      <Button 
                        size="sm" 
                        variant="outline-primary"
                        onClick={() => handleImageSelect(image)}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Details Modal */}
      <ImageDetailsModal 
        image={selectedImage} 
        show={showDetails} 
        onHide={handleCloseDetails} 
      />
    </div>
  );
};

export default BaseImageManagementTab;
