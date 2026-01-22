import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import MetricCard from './MetricCard';

const CodeInventory = ({ 
  microservicesCount,
  languagesCount,
  dependenciesCount,
  apisCount,
  pullRequestsCount,
  commitsCount
}) => {

  
  return (
    <Row className="mb-4">
      <Col>
        <Card>
          <Card.Header>Code Inventory</Card.Header>
          <Card.Body>
            <Row>
              <Col md={2}>
                <MetricCard value={microservicesCount || 0} label="Microservices" />
              </Col>
              <Col md={2}>
                <MetricCard value={languagesCount || 0} label="Languages" />
              </Col>
              <Col md={2}>
                <MetricCard value={dependenciesCount || 0} label="Dependencies" />
              </Col>
              <Col md={2}>
                <MetricCard value={apisCount || 0} label="APIs" />
              </Col>
              <Col md={2}>
                <MetricCard value={pullRequestsCount || 0} label="Pull Requests" />
              </Col>
              <Col md={2}>
                <MetricCard value={commitsCount || 0} label="Commits" />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default CodeInventory;
