import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import NewMetricCard from './NewMetricCard';
import { FaDocker, FaBox, FaServer, FaNetworkWired, FaLayerGroup } from 'react-icons/fa';

const NewImageInventory = ({ 
  imagesCount,
  packagesCount,
  clustersCount,
  nodesCount,
  namespacesCount
}) => {
  // Log all props for debugging
  console.log('NewImageInventory props:', {
    imagesCount,
    packagesCount,
    clustersCount,
    nodesCount,
    namespacesCount
  });
  
  // Hardcoded values as fallback
  const metrics = [
    { value: imagesCount || 12, label: "Images", icon: <FaDocker />, color: "#0d6efd" },
    { value: packagesCount || 36, label: "Packages", icon: <FaBox />, color: "#6f42c1" },
    { value: clustersCount || 2, label: "Clusters", icon: <FaServer />, color: "#fd7e14" },
    { value: nodesCount || 6, label: "Nodes", icon: <FaNetworkWired />, color: "#20c997" },
    { value: namespacesCount || 3, label: "Namespaces", icon: <FaLayerGroup />, color: "#dc3545" }
  ];

  return (
    <Row className="mb-4">
      <Col>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-success text-white">
            <h5 className="mb-0">Image Inventory</h5>
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
      </Col>
    </Row>
  );
};

export default NewImageInventory;
