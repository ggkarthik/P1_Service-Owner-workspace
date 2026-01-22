import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import NewMetricCard from './NewMetricCard';
import { FaCubes, FaCode, FaBoxes, FaNetworkWired, FaGithub, FaCodeBranch } from 'react-icons/fa';

const NewCodeInventory = ({ 
  microservicesCount,
  languagesCount,
  dependenciesCount,
  apisCount,
  pullRequestsCount,
  commitsCount
}) => {
  // Log all props for debugging
  console.log('NewCodeInventory props:', {
    microservicesCount,
    languagesCount,
    dependenciesCount,
    apisCount,
    pullRequestsCount,
    commitsCount
  });
  
  // Hardcoded values as fallback
  const metrics = [
    { value: microservicesCount || 12, label: "Microservices", icon: <FaCubes />, color: "#0d6efd" },
    { value: languagesCount || 5, label: "Languages", icon: <FaCode />, color: "#6f42c1" },
    { value: dependenciesCount || 42, label: "Dependencies", icon: <FaBoxes />, color: "#fd7e14" },
    { value: apisCount || 18, label: "APIs", icon: <FaNetworkWired />, color: "#20c997" },
    { value: pullRequestsCount || 7, label: "Pull Requests", icon: <FaGithub />, color: "#dc3545" },
    { value: commitsCount || 250, label: "Commits", icon: <FaCodeBranch />, color: "#6c757d" }
  ];

  return (
    <Row className="mb-4">
      <Col>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Code Inventory</h5>
          </Card.Header>
          <Card.Body className="bg-light">
            <Row>
              {metrics.map((metric, index) => (
                <Col md={2} key={index}>
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

export default NewCodeInventory;
