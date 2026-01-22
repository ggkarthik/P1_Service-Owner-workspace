import React from 'react';
import { Accordion, ListGroup, Table, Badge, Tab, Nav, Row, Col } from 'react-bootstrap';

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

const getSeverityBadge = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'high':
      return 'danger';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'secondary';
  }
};

const ImagesTab = ({ images = [] }) => {
  if (!images || images.length === 0) {
    return <div className="alert alert-info">No image data available.</div>;
  }

  return (
    <Accordion defaultActiveKey="0">
      {images.map((image, index) => (
        <Accordion.Item eventKey={index.toString()} key={index}>
          <Accordion.Header>{image.name}</Accordion.Header>
          <Accordion.Body>
            <Tab.Container defaultActiveKey="layers">
              <Row>
                <Col sm={2}>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="layers">Layers</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="packages">Packages</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={10}>
                  <Tab.Content>
                    <Tab.Pane eventKey="layers">
                      <h5>Image Layers</h5>
                      {image.layers?.length > 0 ? (
                        <ListGroup variant="flush">
                          {image.layers?.map((layer, layerIndex) => (
                            <ListGroup.Item key={layerIndex}>
                              <Badge bg="info" className="me-2">{safeStringify(layer.type) || 'LAYER'}</Badge>
                              <code>{safeStringify(layer.command)}</code>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : (
                        <div className="alert alert-info">No layer information available</div>
                      )}
                    </Tab.Pane>
                    <Tab.Pane eventKey="packages">
                      <h5>Packages</h5>
                      <Table striped bordered hover responsive size="sm">
                        <thead>
                          <tr>
                            <th>Package</th>
                            <th>Version</th>
                            <th>License</th>
                            <th>Status</th>
                            <th>Vulnerabilities</th>
                          </tr>
                        </thead>
                        <tbody>
                          {image.packages?.length > 0 ? (
                            image.packages.map((pkg, pkgIndex) => (
                              <tr key={pkgIndex}>
                                <td>{typeof pkg === 'string' ? pkg : safeStringify(pkg.name) || 'Unknown'}</td>
                                <td>{typeof pkg === 'string' ? 'N/A' : safeStringify(pkg.version) || 'N/A'}</td>
                                <td>{typeof pkg === 'string' ? 'Unknown' : safeStringify(pkg.license) || 'Unknown'}</td>
                                <td>{typeof pkg === 'string' ? 'N/A' : safeStringify(pkg.status) || 'N/A'}</td>
                                <td>
                                  {typeof pkg !== 'string' && pkg.vulnerabilities && pkg.vulnerabilities.length > 0 ? (
                                    pkg.vulnerabilities.map((vuln, vulnIndex) => (
                                      <Badge bg={getSeverityBadge(vuln.severity)} key={vulnIndex} className="me-1">
                                        {vuln.id}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-muted">None</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center">No package information available</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default ImagesTab;
