import React, { useState } from 'react';
import { Tabs, Tab, Badge, Button, Table, ProgressBar, Card, Row, Col } from 'react-bootstrap';
import { 
  FaServer, 
  FaCode, 
  FaChartLine, 
  FaShieldAlt,
  FaExclamationTriangle,
  FaBolt,
  FaDatabase,
  FaCloudversify,
  FaTools,
  FaNetworkWired,
  FaBox,
  FaLayerGroup
} from 'react-icons/fa';
import './ServiceOwnerWorkspace.css';

const ServiceInventory = ({ selectedService, serviceInventoryData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Safety check for selectedService
  if (!selectedService) {
    return (
      <div className="info-card">
        <h3><FaServer /> Service Composition & Inventory</h3>
        <div className="alert alert-info">Please select a service to view its inventory.</div>
      </div>
    );
  }
  
  // Find the service in the inventory data
  // Handle both data structures: services.services (microservices_inventory.json) or services (service_inventory.json)
  const servicesList = serviceInventoryData?.services?.services || serviceInventoryData?.services || [];
  const inventoryService = servicesList.find(s => 
    s && s.name === selectedService.name
  );
  
  // Fallback to service owner data if inventory data is not available
  const composition = selectedService.composition || {
    containers: 1,
    pods: 2,
    dependencies: [],
    language: selectedService.language || 'Unknown',
    frameworks: [],
    deployment_type: 'Kubernetes',
    resource_usage: { cpu: '10%', memory: '64Mi', disk: '20%' }
  };
  
  // Define default service metrics based on service language and name
  const getServiceMetrics = (service) => {
    if (!service) return {
      apis: 1,
      dependencies: 3,
      frameworks: 2,
      tools: 3,
      databases: 0,
      cloudPlatforms: 1,
      containers: 1,
      files: 6,
      loc: 700
    };
    
    const serviceName = service.name;
    const serviceLanguage = service.language;
    
    // Database usage by service
    const hasDatabase = serviceName === 'cartservice' || 
                       serviceName === 'checkoutservice' || 
                       serviceName === 'adservice' || 
                       serviceName === 'productcatalogservice';
    
    // Files count by language
    let filesCount = 6; // default
    if (serviceLanguage === 'Go') filesCount = 10;
    else if (serviceLanguage === 'C#') filesCount = 8;
    else if (serviceLanguage === 'Node.js') filesCount = 7;
    else if (serviceLanguage === 'Java') filesCount = 12;
    
    // Lines of code by language
    let linesOfCode = 700; // default
    if (serviceLanguage === 'Go') linesOfCode = 1200;
    else if (serviceLanguage === 'C#') linesOfCode = 950;
    else if (serviceLanguage === 'Node.js') linesOfCode = 850;
    else if (serviceLanguage === 'Java') linesOfCode = 1500;
    
    return {
      apis: 1,
      dependencies: 3,
      frameworks: 2,
      tools: 3,
      databases: hasDatabase ? 1 : 0,
      cloudPlatforms: 1,
      containers: 1,
      files: filesCount,
      loc: linesOfCode
    };
  };
  
  const defaultServiceMetrics = getServiceMetrics(selectedService);
  
  // Create mock data for tabs that are currently empty
  const mockServiceData = {
    infrastructure: {
      deployment: {
        replicas: 3,
        strategy: 'RollingUpdate',
        containers: [
          { name: selectedService.name, image: `gcr.io/microservices-demo/${selectedService.name}:v0.3.9` }
        ]
      },
      resources: {
        requests: {
          cpu: '100m',
          memory: '64Mi'
        },
        limits: {
          cpu: '200m',
          memory: '128Mi'
        }
      },
      service: {
        type: 'ClusterIP',
        ports: [
          { name: 'grpc', port: 9555, targetPort: 9555 }
        ]
      },
      security: {
        serviceAccount: 'default',
        securityContext: {
          runAsNonRoot: true,
          runAsUser: 1000
        }
      },
      config: {
        env: [
          { name: 'PORT', value: '9555' },
          { name: 'ENABLE_PROFILER', value: 'false' }
        ]
      },
      configMaps: [
        { name: `${selectedService.name}-config`, keys: ['environment', 'log-level'] }
      ],
      secrets: [
        { name: `${selectedService.name}-secrets`, keys: ['api-key'] }
      ]
    },
    dependencies: [
      { name: 'grpc', version: 'v1.38.0', type: 'direct' },
      { name: 'protobuf', version: 'v1.28.0', type: 'direct' },
      { name: 'opentelemetry', version: 'v1.2.0', type: 'direct' },
    ],
    api: {
      protocol: 'gRPC',
      server_endpoints: [
        { name: 'Get', request_type: 'GetRequest', response_type: 'GetResponse' },
        { name: 'List', request_type: 'ListRequest', response_type: 'ListResponse' }
      ],
      endpoints: [
        {
          name: `${selectedService.name}Service`,
          path: `/${selectedService.name.toLowerCase()}/v1`,
          method: 'gRPC',
          description: `${selectedService.name} service endpoint`
        }
      ],
      client_connections: [
        { target_service: 'redis', protocol: 'TCP', port: 6379 }
      ],
      proto: `service ${selectedService.name}Service {
  rpc Get(GetRequest) returns (GetResponse) {}
  rpc List(ListRequest) returns (ListResponse) {}
}`
    },
    deployment: {
      container_registry: 'gcr.io/microservices-demo',
      image_registry: 'gcr.io/microservices-demo',
      image_name: selectedService.name,
      image_tag: 'v0.3.9',
      deployment_strategy: 'RollingUpdate',
      environment: 'production',
      health_checks: {
        readiness: true,
        liveness: true
      },
      scaling: {
        auto_scaling: true,
        min_replicas: 1,
        max_replicas: 5
      }
    },
    code_metrics: {
      loc: defaultServiceMetrics.loc,
      files: defaultServiceMetrics.files,
      complexity: 'medium',
      test_coverage: '78%',
      last_commit: '2025-09-01'
    }
  };
  
  // Merge mock data with actual data if available
  const enhancedInventoryService = inventoryService ? {
    ...inventoryService,
    ...mockServiceData
  } : {
    name: selectedService.name,
    language: selectedService.language,
    description: selectedService.description || `${selectedService.name} microservice`,
    ...mockServiceData
  };
  
  // Using defaultServiceMetrics for service-specific metrics

  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="info-card">
      <h3><FaServer /> Service Composition & Inventory</h3>
      <div className="service-inventory">
        <Tabs
          activeKey={activeTab}
          onSelect={handleTabSelect}
          className="service-inventory-tabs mb-3"
        >
          <Tab eventKey="overview" title="Overview">
            {/* Inventory Insights Cards */}
            <div className="mb-4">
              <h4 className="mb-3">Service Inventory Insights: {selectedService.name}</h4>
              <Row>
                <Col md={3} className="mb-3">
                  <Card className="h-100 inventory-card">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <FaCode className="text-success me-2" size={24} />
                        <h5 className="mb-0">Language</h5>
                      </div>
                      <h2 className="mt-3 mb-0">{inventoryService?.language || selectedService.language}</h2>
                      <p className="text-muted">Programming language</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} className="mb-3">
                  <Card className="h-100 inventory-card">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <FaBox className="text-warning me-2" size={24} />
                        <h5 className="mb-0">Dependencies</h5>
                      </div>
                      <h2 className="mt-3 mb-0">{defaultServiceMetrics.dependencies || composition.dependencies.length}</h2>
                      <p className="text-muted">Service packages</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} className="mb-3">
                  <Card className="h-100 inventory-card">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <FaNetworkWired className="text-info me-2" size={24} />
                        <h5 className="mb-0">APIs</h5>
                      </div>
                      <h2 className="mt-3 mb-0">{defaultServiceMetrics.apis || 1}</h2>
                      <p className="text-muted">Service endpoints</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} className="mb-3">
                  <Card className="h-100 inventory-card">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <FaLayerGroup className="text-secondary me-2" size={24} />
                        <h5 className="mb-0">Frameworks</h5>
                      </div>
                      <h2 className="mt-3 mb-0">{defaultServiceMetrics.frameworks || composition.frameworks.length}</h2>
                      <p className="text-muted">Service frameworks</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col md={3} className="mb-3">
                  <Card className="h-100 inventory-card">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <FaDatabase className="text-danger me-2" size={24} />
                        <h5 className="mb-0">Databases</h5>
                      </div>
                      <h2 className="mt-3 mb-0">{defaultServiceMetrics.databases || 0}</h2>
                      <p className="text-muted">Service data stores</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} className="mb-3">
                  <Card className="h-100 inventory-card">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <FaServer className="text-primary me-2" size={24} />
                        <h5 className="mb-0">Containers</h5>
                      </div>
                      <h2 className="mt-3 mb-0">{defaultServiceMetrics.containers || composition.containers}</h2>
                      <p className="text-muted">Service containers</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} className="mb-3">
                  <Card className="h-100 inventory-card">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <FaTools className="text-dark me-2" size={24} />
                        <h5 className="mb-0">Tools</h5>
                      </div>
                      <h2 className="mt-3 mb-0">{defaultServiceMetrics.tools || 3}</h2>
                      <p className="text-muted">DevOps tools</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} className="mb-3">
                  <Card className="h-100 inventory-card">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <FaCode className="text-info me-2" size={24} />
                        <h5 className="mb-0">Code</h5>
                      </div>
                      <h2 className="mt-3 mb-0">{defaultServiceMetrics.files || 5}</h2>
                      <p className="text-muted">Files ({defaultServiceMetrics.loc.toLocaleString()} LOC)</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
            
            {/* Enhanced Service Architecture Tree */}
            <div className="mb-4">
              <h4 className="mb-3">Service Architecture</h4>
              <div className="service-tree-container">
                <div className="service-tree">
                  <div className="service-tree-node root">
                    <div className="service-tree-content">
                      <FaServer className="me-2" /> Online Boutique
                    </div>
                    <div className="service-tree-children">
                      {(servicesList && servicesList.length > 0) ? (
                        servicesList.map((service, index) => {
                          if (!service || !service.name) return null;
                          
                          const isSelected = service.name === selectedService.name;
                          const serviceMetricsData = isSelected ? defaultServiceMetrics : null;
                          const serviceLanguage = service.language || 'Unknown';
                          
                          return (
                            <div key={index} className={`service-tree-node ${isSelected ? 'selected-service-node' : ''}`}>
                            <div className={`service-tree-content ${serviceLanguage.toLowerCase().replace('/', '-')}`}>
                              <div className="d-flex justify-content-between align-items-center w-100">
                                <span className="service-name">{service.name}</span>
                                <Badge bg="secondary" className="ms-2">{service.language}</Badge>
                              </div>
                              {isSelected && (
                                <div className="service-metrics-summary mt-2">
                                  <small className="d-block text-white-50 mb-1">{service.description || 'No description available'}</small>
                                  <div className="d-flex justify-content-between">
                                    <span><FaBox className="me-1" size={10} /> {serviceMetricsData?.dependencies || 0} deps</span>
                                    <span><FaNetworkWired className="me-1" size={10} /> {serviceMetricsData?.apis || 1} APIs</span>
                                    <span><FaCode className="me-1" size={10} /> {serviceMetricsData?.files || 5} files</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <div className="service-tree-children">
                                {/* Dependencies */}
                                {(composition.dependencies && composition.dependencies.length > 0) ? (
                                  <div className="service-tree-node">
                                    <div className="service-tree-content dependency-group">
                                      <span className="dependency-group-title">Dependencies</span>
                                    </div>
                                    <div className="service-tree-children dependency-list">
                                      {composition.dependencies.map((dep, idx) => (
                                        <div key={idx} className="service-tree-node leaf">
                                          <div className="service-tree-content dependency">
                                            <span>{dep}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="service-tree-node leaf">
                                    <div className="service-tree-content dependency-group">
                                      <span>No dependencies</span>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Frameworks */}
                                {(serviceMetricsData?.frameworks || 0) > 0 && (
                                  <div className="service-tree-node">
                                    <div className="service-tree-content framework-group">
                                      <span className="framework-group-title">Frameworks</span>
                                    </div>
                                    <div className="service-tree-children framework-list">
                                      {/* Map language to common frameworks */}
                                      {(() => {
                                        const langFrameworkMap = {
                                          'Go': ['gRPC', 'Gin', 'Gorilla/Mux'],
                                          'C#': ['.NET Core', 'gRPC-dotnet'],
                                          'Node.js': ['Express', 'gRPC-js'],
                                          'Python': ['Flask', 'gRPC-python'],
                                          'Java': ['Spring Boot', 'gRPC-Java'],
                                          'Python/Locust': ['Locust', 'Flask']
                                        };
                                        
                                        const frameworks = langFrameworkMap[serviceLanguage] || [];
                                        return frameworks.map((framework, idx) => (
                                          <div key={idx} className="service-tree-node leaf">
                                            <div className="service-tree-content framework">
                                              <span>{framework}</span>
                                            </div>
                                          </div>
                                        ));
                                      })()}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Databases */}
                                {(serviceMetricsData?.databases || 0) > 0 && (
                                  <div className="service-tree-node">
                                    <div className="service-tree-content database-group">
                                      <span className="database-group-title">Databases</span>
                                    </div>
                                    <div className="service-tree-children database-list">
                                      {(() => {
                                        const serviceDbMap = {
                                          'cartservice': ['Redis'],
                                          'checkoutservice': ['Redis'],
                                          'adservice': ['MongoDB'],
                                          'productcatalogservice': ['PostgreSQL']
                                        };
                                        
                                        const databases = serviceDbMap[service?.name] || [];
                                        return databases.map((db, idx) => (
                                          <div key={idx} className="service-tree-node leaf">
                                            <div className="service-tree-content database">
                                              <span>{db}</span>
                                            </div>
                                          </div>
                                        ));
                                      })()}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                      ) : (
                        <div className="service-tree-node">
                          <div className="service-tree-content">No services data available</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="inventory-details">
              <div className="inventory-section">
                <div className="inventory-section-title">
                  <FaCode style={{ color: '#667eea' }} /> Technical Stack
                </div>
                <ul className="inventory-list">
                  <li className="inventory-item">
                    <span className="inventory-item-label">Language:</span>
                    <span className="inventory-item-value">
                      <span className={`inventory-badge ${composition.language.toLowerCase()}`}>
                        {composition.language}
                      </span>
                    </span>
                  </li>
                  <li className="inventory-item">
                    <span className="inventory-item-label">Frameworks:</span>
                    <span className="inventory-item-value">
                      {composition.frameworks.join(', ') || 'None specified'}
                    </span>
                  </li>
                  <li className="inventory-item">
                    <span className="inventory-item-label">Deployment Type:</span>
                    <span className="inventory-item-value">{composition.deployment_type}</span>
                  </li>
                </ul>
              </div>
              
              {/* Add inventory data from service inventory */}
              {enhancedInventoryService && (
                <div className="inventory-section">
                  <div className="inventory-section-title">
                    <FaChartLine style={{ color: '#667eea' }} /> Code Metrics
                  </div>
                  <ul className="inventory-list">
                    <li className="inventory-item">
                      <span className="inventory-item-label">Lines of Code:</span>
                      <span className="inventory-item-value">
                        {enhancedInventoryService.code_metrics.loc.toLocaleString()}
                      </span>
                    </li>
                    <li className="inventory-item">
                      <span className="inventory-item-label">Files:</span>
                      <span className="inventory-item-value">
                        {enhancedInventoryService.code_metrics.files}
                      </span>
                    </li>
                    <li className="inventory-item">
                      <span className="inventory-item-label">Complexity:</span>
                      <span className="inventory-item-value">
                        <Badge bg={
                          enhancedInventoryService.code_metrics.complexity === 'high' ? 'danger' : 
                          enhancedInventoryService.code_metrics.complexity === 'medium' ? 'warning' : 'success'
                        }>
                          {enhancedInventoryService.code_metrics.complexity.charAt(0).toUpperCase() + 
                           enhancedInventoryService.code_metrics.complexity.slice(1)}
                        </Badge>
                      </span>
                    </li>
                    <li className="inventory-item">
                      <span className="inventory-item-label">Test Coverage:</span>
                      <span className="inventory-item-value">
                        <div style={{ width: '100px', display: 'inline-block', marginBottom: '2px' }}>
                          <ProgressBar 
                            now={enhancedInventoryService.code_metrics.test_coverage} 
                            style={{ height: '8px' }}
                          />
                        </div>
                        <span style={{ marginLeft: '8px' }}>
                          {enhancedInventoryService.code_metrics.test_coverage}%
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>
              )}
              
              <div className="inventory-section">
                <div className="inventory-section-title">
                  <FaServer style={{ color: '#667eea' }} /> Infrastructure
                </div>
                <ul className="inventory-list">
                  <li className="inventory-item">
                    <span className="inventory-item-label">Containers:</span>
                    <span className="inventory-item-value">{composition.containers}</span>
                  </li>
                  <li className="inventory-item">
                    <span className="inventory-item-label">Pods:</span>
                    <span className="inventory-item-value">{composition.pods}</span>
                  </li>
                  <li className="inventory-item">
                    <span className="inventory-item-label">Replicas:</span>
                    <span className="inventory-item-value">
                      {composition.replicas || composition.pods}
                    </span>
                  </li>
                </ul>
              </div>
              
              <div className="inventory-section">
                <div className="inventory-section-title">
                  <FaChartLine style={{ color: '#667eea' }} /> Resource Usage
                </div>
                <ul className="inventory-list">
                  <li className="inventory-item">
                    <span className="inventory-item-label">CPU:</span>
                    <span className="inventory-item-value">{composition.resource_usage.cpu}</span>
                  </li>
                  <li className="inventory-item">
                    <span className="inventory-item-label">Memory:</span>
                    <span className="inventory-item-value">{composition.resource_usage.memory}</span>
                  </li>
                  <li className="inventory-item">
                    <span className="inventory-item-label">Disk:</span>
                    <span className="inventory-item-value">{composition.resource_usage.disk}</span>
                  </li>
                </ul>
              </div>
            </div>
          </Tab>
          
          <Tab eventKey="resources" title="Resources">
            {/* Resources Tab Content */}
            {enhancedInventoryService && enhancedInventoryService.infrastructure ? (
              <div className="inventory-details">
                <div className="inventory-section">
                  <div className="inventory-section-title">
                    <FaServer style={{ color: '#667eea' }} /> Kubernetes Resources
                  </div>
                  <Table size="sm" bordered>
                    <thead className="table-light">
                      <tr>
                        <th>Resource Type</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Deployment</td>
                        <td>
                          <strong>Replicas:</strong> {enhancedInventoryService.infrastructure.deployment.replicas}<br/>
                          <strong>Strategy:</strong> {enhancedInventoryService.infrastructure.deployment.strategy}<br/>
                          <strong>Service Account:</strong> {enhancedInventoryService.infrastructure.security.serviceAccount}
                        </td>
                      </tr>
                      <tr>
                        <td>Service</td>
                        <td>
                          <strong>Type:</strong> {enhancedInventoryService.infrastructure.service.type}<br/>
                          <strong>Ports:</strong> {(enhancedInventoryService.infrastructure.service.ports || []).map(p => 
                            `${p.port}:${p.targetPort}`).join(', ')}
                        </td>
                      </tr>
                      <tr>
                        <td>Resource Limits</td>
                        <td>
                          <strong>CPU:</strong> {enhancedInventoryService.infrastructure.resources.limits.cpu}<br/>
                          <strong>Memory:</strong> {enhancedInventoryService.infrastructure.resources.limits.memory}
                        </td>
                      </tr>
                      <tr>
                        <td>Resource Requests</td>
                        <td>
                          <strong>CPU:</strong> {enhancedInventoryService.infrastructure.resources.requests.cpu}<br/>
                          <strong>Memory:</strong> {enhancedInventoryService.infrastructure.resources.requests.memory}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
                
                <div className="inventory-section">
                  <div className="inventory-section-title">
                    <FaChartLine style={{ color: '#667eea' }} /> Container Details
                  </div>
                  <Table size="sm" bordered>
                    <thead className="table-light">
                      <tr>
                        <th>Container</th>
                        <th>Image</th>
                        <th>Ports</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(enhancedInventoryService.infrastructure.deployment.containers || []).map((container, idx) => (
                        <tr key={idx}>
                          <td>{container.name}</td>
                          <td>{container.image}</td>
                          <td>{(container.ports || []).map(p => p.containerPort).join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                
                {(enhancedInventoryService.infrastructure.config.env && enhancedInventoryService.infrastructure.config.env.length > 0) && (
                  <div className="inventory-section">
                    <div className="inventory-section-title">
                      <FaChartLine style={{ color: '#667eea' }} /> Environment Variables
                    </div>
                    <Table size="sm" bordered>
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(enhancedInventoryService.infrastructure.config.env || []).map((env, idx) => (
                          <tr key={idx}>
                            <td>{env.name}</td>
                            <td>{env.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </div>
            ) : (
              <div className="alert alert-info">
                No detailed resource information available for this service.
              </div>
            )}
          </Tab>
          
          <Tab eventKey="dependencies" title="Dependencies">
            {/* Dependencies Tab Content */}
            {enhancedInventoryService && enhancedInventoryService.dependencies && 
             enhancedInventoryService.dependencies.length > 0 ? (
              <div className="inventory-details">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 style={{ margin: 0 }}>
                    Total Dependencies: {enhancedInventoryService.dependencies.length}
                  </h5>
                  <div className="input-group" style={{ width: '300px' }}>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      placeholder="Search dependencies..." 
                    />
                    <Button variant="outline-secondary" size="sm">Search</Button>
                  </div>
                </div>
                
                <Table size="sm" hover>
                  <thead className="table-light">
                    <tr>
                      <th>Package</th>
                      <th>Version</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(enhancedInventoryService.dependencies || []).slice(0, 10).map((dep, idx) => (
                      <tr key={idx}>
                        <td>{dep.name}</td>
                        <td>{dep.version}</td>
                        <td>
                          <Badge bg={dep.type === 'production' ? 'primary' : 'secondary'}>
                            {dep.type}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {enhancedInventoryService.dependencies.length > 10 && (
                      <tr>
                        <td colSpan="3" className="text-center">
                          <Button variant="link" size="sm">
                            Load more ({enhancedInventoryService.dependencies.length - 10} remaining)
                          </Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="alert alert-info">
                No dependencies found for this service.
              </div>
            )}
          </Tab>
          
          <Tab eventKey="api" title="API">
            {/* API Tab Content */}
            {enhancedInventoryService && enhancedInventoryService.api ? (
              <div className="inventory-details">
                <div className="inventory-section">
                  <div className="inventory-section-title d-flex justify-content-between align-items-center">
                    <div>
                      <FaCode style={{ color: '#667eea' }} /> API Protocol: {enhancedInventoryService.api.protocol}
                    </div>
                    <Badge bg="info">
                      {enhancedInventoryService.api.server_endpoints.length} Endpoints
                    </Badge>
                  </div>
                  
                  {enhancedInventoryService.api.server_endpoints.length > 0 && (
                    <div className="mt-3">
                      <h6>Server Endpoints</h6>
                      <Table size="sm" bordered>
                        <thead className="table-light">
                          <tr>
                            <th>Method</th>
                            <th>Request Type</th>
                            <th>Response Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(enhancedInventoryService.api.server_endpoints || []).map((endpoint, idx) => (
                            <tr key={idx}>
                              <td>{endpoint.name}</td>
                              <td><code>{endpoint.request_type}</code></td>
                              <td><code>{endpoint.response_type}</code></td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                  
                  {enhancedInventoryService.api.endpoints.length > 0 && (
                    <div className="mt-3">
                      <h6>HTTP Endpoints</h6>
                      <Table size="sm" bordered>
                        <thead className="table-light">
                          <tr>
                            <th>Path</th>
                            <th>Method</th>
                            <th>Protocol</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(enhancedInventoryService.api.endpoints || []).map((endpoint, idx) => (
                            <tr key={idx}>
                              <td>{endpoint.path}</td>
                              <td>{endpoint.method}</td>
                              <td>{endpoint.protocol}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                  
                  {enhancedInventoryService.api.client_connections.length > 0 && (
                    <div className="mt-3">
                      <h6>Client Connections</h6>
                      <Table size="sm" bordered>
                        <thead className="table-light">
                          <tr>
                            <th>Target Service</th>
                            <th>Protocol</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(enhancedInventoryService.api.client_connections || []).map((conn, idx) => (
                            <tr key={idx}>
                              <td>{conn.target_service}</td>
                              <td>{conn.protocol}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="alert alert-info">
                No API information available for this service.
              </div>
            )}
          </Tab>
          
          <Tab eventKey="deployment" title="Deployment">
            {/* Deployment Tab Content */}
            {enhancedInventoryService && enhancedInventoryService.deployment ? (
              <div className="inventory-details">
                <div className="inventory-section">
                  <div className="inventory-section-title">
                    <FaServer style={{ color: '#667eea' }} /> Deployment Configuration
                  </div>
                  <ul className="inventory-list">
                    <li className="inventory-item">
                      <span className="inventory-item-label">Container Registry:</span>
                      <span className="inventory-item-value">
                        {enhancedInventoryService.deployment.container_registry}
                      </span>
                    </li>
                    <li className="inventory-item">
                      <span className="inventory-item-label">Image Tag:</span>
                      <span className="inventory-item-value">
                        {enhancedInventoryService.deployment.image_tag}
                      </span>
                    </li>
                    <li className="inventory-item">
                      <span className="inventory-item-label">Deployment Strategy:</span>
                      <span className="inventory-item-value">
                        {enhancedInventoryService.deployment.deployment_strategy}
                      </span>
                    </li>
                    <li className="inventory-item">
                      <span className="inventory-item-label">Environment:</span>
                      <span className="inventory-item-value">
                        {enhancedInventoryService.deployment.environment}
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div className="inventory-section">
                  <div className="inventory-section-title">
                    <FaChartLine style={{ color: '#667eea' }} /> Health & Scaling
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header">Health Checks</div>
                        <div className="card-body">
                          <ul className="list-group">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              Readiness Probe
                              {enhancedInventoryService.deployment.health_checks.readiness ? 
                                <Badge bg="success">Enabled</Badge> : 
                                <Badge bg="danger">Disabled</Badge>}
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              Liveness Probe
                              {enhancedInventoryService.deployment.health_checks.liveness ? 
                                <Badge bg="success">Enabled</Badge> : 
                                <Badge bg="danger">Disabled</Badge>}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header">Scaling Configuration</div>
                        <div className="card-body">
                          <ul className="list-group">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              Auto Scaling
                              {enhancedInventoryService.deployment.scaling.auto_scaling ? 
                                <Badge bg="success">Enabled</Badge> : 
                                <Badge bg="warning">Disabled</Badge>}
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              Min Replicas
                              <Badge bg="primary">{enhancedInventoryService.deployment.scaling.min_replicas}</Badge>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              Max Replicas
                              <Badge bg="primary">{enhancedInventoryService.deployment.scaling.max_replicas}</Badge>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-info">
                No deployment information available for this service.
              </div>
            )}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default ServiceInventory;
