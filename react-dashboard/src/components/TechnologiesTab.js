import React from 'react';
import { Row, Col, Card, Table, Badge, ProgressBar } from 'react-bootstrap';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const TechnologiesTab = ({ technologies }) => {
  // Add null checks
  const languages = technologies?.languages || {};
  const frameworks = technologies?.frameworks || [];
  const databases = technologies?.databases || [];
  const cloud_platforms = technologies?.cloud_platforms || [];
  const tools = technologies?.tools || [];
  const language_distribution = technologies?.language_distribution || {};
  const primary_language = technologies?.primary_language || 'Unknown';

  // Prepare language chart data
  const languageChartData = {
    labels: Object.keys(languages),
    datasets: [
      {
        data: Object.values(languages),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#00CC99',
          '#FF6666',
          '#CCCCFF',
          '#FFCC99'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#00CC99',
          '#FF6666',
          '#CCCCFF',
          '#FFCC99'
        ]
      }
    ]
  };

  // Prepare language distribution bar chart
  const distributionChartData = {
    labels: Object.keys(language_distribution),
    datasets: [
      {
        label: 'Language Distribution (%)',
        data: Object.values(language_distribution),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#00CC99',
          '#FF6666',
          '#CCCCFF',
          '#FFCC99'
        ]
      }
    ]
  };

  // Get confidence badge color
  const getConfidenceBadgeColor = (confidence) => {
    if (confidence >= 0.9) return 'success';
    if (confidence >= 0.7) return 'info';
    if (confidence >= 0.5) return 'warning';
    return 'danger';
  };

  return (
    <div>
      <h2 className="mb-4">Technology Detection</h2>
      
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>Primary Language: {primary_language}</Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Pie data={languageChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>Language Distribution</Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={distributionChartData} 
                  options={{ 
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }} 
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>Frameworks & Libraries</Card.Header>
            <Card.Body>
              {frameworks.length === 0 ? (
                <div className="alert alert-info">No framework data available.</div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {frameworks.map((framework, index) => (
                      <tr key={index}>
                        <td>{framework.name}</td>
                        <td>{framework.category}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <ProgressBar 
                              now={framework.confidence * 100} 
                              variant={getConfidenceBadgeColor(framework.confidence)} 
                              className="flex-grow-1 me-2" 
                            />
                            <span>{Math.round(framework.confidence * 100)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>Databases</Card.Header>
            <Card.Body>
              {databases.length === 0 ? (
                <div className="alert alert-info">No database data available.</div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databases.map((db, index) => (
                      <tr key={index}>
                        <td>{db.name}</td>
                        <td>
                          <Badge bg={getConfidenceBadgeColor(db.confidence)}>
                            {Math.round(db.confidence * 100)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>Cloud Platforms</Card.Header>
            <Card.Body>
              {cloud_platforms.length === 0 ? (
                <div className="alert alert-info">No cloud platform data available.</div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cloud_platforms.map((platform, index) => (
                      <tr key={index}>
                        <td>{platform.name}</td>
                        <td>
                          <Badge bg={getConfidenceBadgeColor(platform.confidence)}>
                            {Math.round(platform.confidence * 100)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card>
        <Card.Header>Development Tools</Card.Header>
        <Card.Body>
          {tools.length === 0 ? (
            <div className="alert alert-info">No tool data available.</div>
          ) : (
            <div className="d-flex flex-wrap">
              {tools.map((tool, index) => (
                <div key={index} className="me-2 mb-2">
                  <Badge 
                    bg={getConfidenceBadgeColor(tool.confidence)}
                    className="p-2"
                  >
                    {tool.name} ({tool.category})
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TechnologiesTab;
