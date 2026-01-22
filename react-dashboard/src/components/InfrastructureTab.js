import React from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';

const InfrastructureTab = ({ infrastructure }) => {
  // Add null checks
  const pipelines = infrastructure?.pipelines || [];
  const artifacts = infrastructure?.artifacts || [];
  const infra = infrastructure?.infrastructure || [];
  
  return (
    <div>
      <h2 className="mb-4">Infrastructure</h2>
      
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>Pipelines</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Path</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pipelines.map((pipeline, index) => (
                    <tr key={index}>
                      <td>{pipeline.name}</td>
                      <td>{pipeline.type}</td>
                      <td>{pipeline.path}</td>
                      <td>
                        <Badge bg={pipeline.status === 'active' ? 'success' : 'secondary'}>
                          {pipeline.status || 'N/A'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>Artifacts</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Path</th>
                  </tr>
                </thead>
                <tbody>
                  {artifacts.map((artifact, index) => (
                    <tr key={index}>
                      <td>{artifact.name}</td>
                      <td>{artifact.type}</td>
                      <td>{artifact.path}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {infra && infra.length > 0 && (
        <Card>
          <Card.Header>Infrastructure Resources</Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Resources</th>
                  <th>Providers</th>
                  <th>Environments</th>
                </tr>
              </thead>
              <tbody>
                {infra.map((item, index) => (
                  <tr key={index}>
                    <td>{item.type}</td>
                    <td>
                      {item.resources && item.resources.map((resource, i) => (
                        <Badge bg="info" className="me-1" key={i}>{resource}</Badge>
                      ))}
                    </td>
                    <td>
                      {item.providers && item.providers.map((provider, i) => (
                        <Badge bg="primary" className="me-1" key={i}>{provider}</Badge>
                      ))}
                    </td>
                    <td>
                      {item.environments && item.environments.map((env, i) => (
                        <Badge bg="success" className="me-1" key={i}>{env}</Badge>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default InfrastructureTab;
