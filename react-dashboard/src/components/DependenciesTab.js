import React, { useState } from 'react';
import { Card, Table, Row, Col, Badge, Form, InputGroup, Nav, Tab, ProgressBar } from 'react-bootstrap';
import { Pie, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { FaSearch, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaFilter } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DependenciesTab = ({ dependencies }) => {
  // Add null checks
  const deps = dependencies?.dependencies || [];
  const total_count = dependencies?.total_count || 0;
  const vulnerable_count = dependencies?.vulnerable_count || 0;
  const outdated_count = dependencies?.outdated_count || 0;
  const license_distribution = dependencies?.license_distribution || {};
  const source_distribution = dependencies?.source_distribution || {};
  
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get unique dependency types and sources for filters
  const dependencyTypes = ['all', ...new Set(deps.map(dep => dep.type))];
  const dependencySources = ['all', ...new Set(deps.map(dep => dep.source))];
  
  // Filter dependencies based on search term and filters
  const filteredDeps = deps.filter(dep => {
    const matchesSearch = dep.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || dep.type === filterType;
    const matchesSource = filterSource === 'all' || dep.source === filterSource;
    return matchesSearch && matchesType && matchesSource;
  });
  
  // Prepare license chart data
  const licenseChartData = {
    labels: Object.keys(license_distribution),
    datasets: [
      {
        data: Object.values(license_distribution),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  };
  
  // Prepare source chart data
  const sourceChartData = {
    labels: Object.keys(source_distribution),
    datasets: [
      {
        data: Object.values(source_distribution),
        backgroundColor: [
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384'
        ],
        hoverBackgroundColor: [
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384'
        ]
      }
    ]
  };
  
  // Prepare status chart data
  const statusData = {
    labels: ['Up to Date', 'Outdated', 'Vulnerable'],
    datasets: [
      {
        data: [
          total_count - (outdated_count + vulnerable_count),
          outdated_count,
          vulnerable_count
        ],
        backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
        hoverBackgroundColor: ['#28a745', '#ffc107', '#dc3545']
      }
    ]
  };
  
  // Prepare dependency types chart data
  const typeDistribution = {};
  deps.forEach(dep => {
    typeDistribution[dep.type] = (typeDistribution[dep.type] || 0) + 1;
  });
  
  const typesChartData = {
    labels: Object.keys(typeDistribution),
    datasets: [
      {
        label: 'Dependency Types',
        data: Object.values(typeDistribution),
        backgroundColor: [
          '#8884d8',
          '#83a6ed',
          '#8dd1e1',
          '#82ca9d',
          '#a4de6c',
          '#d0ed57'
        ]
      }
    ]
  };

  return (
    <div>
      <h2 className="mb-4">Dependency Analysis</h2>
      
      <Tab.Container id="dependency-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="overview">Overview</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="list">Dependencies List</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="licenses">Licenses</Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Tab.Content>
          <Tab.Pane eventKey="overview">
            <Row className="mb-4">
              <Col md={4}>
                <Card className="h-100">
                  <Card.Header>Dependency Statistics</Card.Header>
                  <Card.Body>
                    <div className="d-flex flex-column">
                      <div className="mb-3 text-center">
                        <h3>{total_count}</h3>
                        <p className="text-muted">Total Dependencies</p>
                      </div>
                      <div className="mb-2">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Up to Date</span>
                          <span className="text-success">{total_count - (outdated_count + vulnerable_count)}</span>
                        </div>
                        <ProgressBar variant="success" now={(total_count - (outdated_count + vulnerable_count)) / total_count * 100} />
                      </div>
                      <div className="mb-2">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Outdated</span>
                          <span className="text-warning">{outdated_count}</span>
                        </div>
                        <ProgressBar variant="warning" now={outdated_count / total_count * 100} />
                      </div>
                      <div>
                        <div className="d-flex justify-content-between mb-1">
                          <span>Vulnerable</span>
                          <span className="text-danger">{vulnerable_count}</span>
                        </div>
                        <ProgressBar variant="danger" now={vulnerable_count / total_count * 100} />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100">
                  <Card.Header>Dependency Status</Card.Header>
                  <Card.Body>
                    <div style={{ height: '250px' }}>
                      <Doughnut data={statusData} options={{ maintainAspectRatio: false }} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100">
                  <Card.Header>Dependency Types</Card.Header>
                  <Card.Body>
                    <div style={{ height: '250px' }}>
                      <Bar 
                        data={typesChartData} 
                        options={{ 
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true
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
              <Col md={6}>
                <Card>
                  <Card.Header>License Distribution</Card.Header>
                  <Card.Body>
                    <div style={{ height: '300px' }}>
                      <Pie data={licenseChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header>Source Distribution</Card.Header>
                  <Card.Body>
                    <div style={{ height: '300px' }}>
                      <Pie data={sourceChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>
          
          <Tab.Pane eventKey="list">
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Dependencies List</h5>
                  <div className="d-flex">
                    <InputGroup className="me-2" style={{ width: '300px' }}>
                      <InputGroup.Text><FaSearch /></InputGroup.Text>
                      <Form.Control 
                        placeholder="Search dependencies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                    <InputGroup className="me-2" style={{ width: '150px' }}>
                      <InputGroup.Text><FaFilter /></InputGroup.Text>
                      <Form.Select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        {dependencyTypes.map((type, index) => (
                          <option key={index} value={type}>{type === 'all' ? 'All Types' : type}</option>
                        ))}
                      </Form.Select>
                    </InputGroup>
                    <InputGroup style={{ width: '150px' }}>
                      <InputGroup.Text><FaFilter /></InputGroup.Text>
                      <Form.Select 
                        value={filterSource}
                        onChange={(e) => setFilterSource(e.target.value)}
                      >
                        {dependencySources.map((source, index) => (
                          <option key={index} value={source}>{source === 'all' ? 'All Sources' : source}</option>
                        ))}
                      </Form.Select>
                    </InputGroup>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                {filteredDeps.length === 0 ? (
                  <div className="alert alert-info">No dependencies match your search criteria.</div>
                ) : (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Version</th>
                        <th>Type</th>
                        <th>Source</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDeps.map((dep, index) => (
                        <tr key={index}>
                          <td>{dep.name}</td>
                          <td>{dep.version}</td>
                          <td>{dep.type}</td>
                          <td>{dep.source}</td>
                          <td>
                            {dep.is_vulnerable && (
                              <Badge bg="danger" className="me-1"><FaExclamationTriangle className="me-1" />Vulnerable</Badge>
                            )}
                            {dep.is_outdated && (
                              <Badge bg="warning" text="dark" className="me-1"><FaInfoCircle className="me-1" />Outdated</Badge>
                            )}
                            {!dep.is_vulnerable && !dep.is_outdated && (
                              <Badge bg="success"><FaCheckCircle className="me-1" />Up to date</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>
          
          <Tab.Pane eventKey="licenses">
            <Row>
              <Col md={6}>
                <Card>
                  <Card.Header>License Distribution</Card.Header>
                  <Card.Body>
                    <div style={{ height: '300px' }}>
                      <Pie data={licenseChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header>License Breakdown</Card.Header>
                  <Card.Body>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>License</th>
                          <th>Count</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(license_distribution).map(([license, count], index) => {
                          const percentage = (count / Object.values(license_distribution).reduce((a, b) => a + b, 0) * 100).toFixed(1);
                          return (
                            <tr key={index}>
                              <td>{license}</td>
                              <td>{count}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <ProgressBar 
                                    now={percentage} 
                                    variant="info" 
                                    className="flex-grow-1 me-2" 
                                  />
                                  <span>{percentage}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>
          

        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default DependenciesTab;
