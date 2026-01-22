import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import MetricCard from './MetricCard';

const ImageInventory = ({ 
  imagesCount,
  packagesCount,
  clustersCount,
  nodesCount,
  namespacesCount
}) => {
  
  return (
    <Row className="mb-4">
      <Col>
        <Card>
          <Card.Header>Image Inventory</Card.Header>
          <Card.Body>
            <Row>
              <Col md={2}>
                <MetricCard value={imagesCount || 0} label="Images" />
              </Col>
              <Col md={2}>
                <MetricCard value={packagesCount || 0} label="Packages" />
              </Col>
              <Col md={2}>
                <MetricCard value={clustersCount || 0} label="Clusters" />
              </Col>
              <Col md={2}>
                <MetricCard value={nodesCount || 0} label="Nodes" />
              </Col>
              <Col md={2}>
                <MetricCard value={namespacesCount || 0} label="Namespaces" />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ImageInventory;
