import React from 'react';
import { Accordion, ListGroup, Badge, Tab, Nav, Row, Col, Table, Card } from 'react-bootstrap';

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

const BaseImagesTab = ({ images = [], baseImageInsights = {} }) => {
  if (!images || images.length === 0) {
    return <div className="alert alert-info">No image data available.</div>;
  }

  const baseImages = (images || []).reduce((acc, image) => {
    const baseImage = image.baseImage;
    if (baseImage && !acc[baseImage]) {
      acc[baseImage] = [];
    }
    if (baseImage && image.name) {
      acc[baseImage].push(image.name);
    }
    return acc;
  }, {});

  return (
    <Accordion defaultActiveKey="0">
      {Object.entries(baseImages).map(([baseImage, services], index) => (
        <Accordion.Item eventKey={index.toString()} key={index}>
          <Accordion.Header>{safeStringify(baseImage)}</Accordion.Header>
          <Accordion.Body>
            <Tab.Container defaultActiveKey="services">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="services">Services</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="vulnerabilities">Vulnerabilities</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="layers">Layers</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="packages">Packages</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    <Tab.Pane eventKey="services">
                      <h5>Services Using This Base Image</h5>
                      <ListGroup variant="flush">
                        {services.map((service, serviceIndex) => (
                          <ListGroup.Item key={serviceIndex}>{service}</ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Tab.Pane>
                    <Tab.Pane eventKey="vulnerabilities">
                      <h5>Vulnerabilities</h5>
                      {baseImageInsights[baseImage] && baseImageInsights[baseImage]?.vulnerabilities?.length > 0 ? (
                        <ListGroup variant="flush">
                          {baseImageInsights[baseImage]?.vulnerabilities?.map((vuln, vulnIndex) => (
                            <ListGroup.Item key={vulnIndex}>
                              <Badge bg={getSeverityBadge(vuln.severity)} className="me-2">{vuln.id}</Badge>
                              {vuln.description}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : (
                        <div className="alert alert-success">No vulnerabilities found for this base image.</div>
                      )}
                    </Tab.Pane>
                    <Tab.Pane eventKey="layers">
                      <h5>Image Layers</h5>
                      {(images || []).find(img => img.baseImage === baseImage)?.layers?.length > 0 ? (
                        <Table striped bordered hover size="sm">
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Command</th>
                              <th>Size</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(images || []).find(img => img.baseImage === baseImage)?.layers?.map((layer, layerIndex) => (
                              <tr key={layerIndex}>
                                <td><Badge bg="info">{safeStringify(layer.type)}</Badge></td>
                                <td><code>{safeStringify(layer.command)}</code></td>
                                <td>{safeStringify(layer.size_estimate)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <div className="alert alert-info">No layer information available for this image.</div>
                      )}
                    </Tab.Pane>
                    <Tab.Pane eventKey="packages">
                      <h5>Installed Packages</h5>
                      {(images || []).find(img => img.baseImage === baseImage)?.packages?.length > 0 ? (
                        <Card>
                          <Card.Body>
                            <div className="d-flex flex-wrap">
                              {(images || []).find(img => img.baseImage === baseImage)?.packages?.map((pkg, pkgIndex) => (
                                <Badge bg="secondary" className="m-1" key={pkgIndex}>{safeStringify(pkg)}</Badge>
                              ))}
                            </div>
                          </Card.Body>
                        </Card>
                      ) : (
                        <div className="alert alert-info">No package information available for this image.</div>
                      )}
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

export default BaseImagesTab;
