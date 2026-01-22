import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';
import Header from './components/Header';
import CodeInventory from './components/CodeInventory';
import ImageInventory from './components/ImageInventory';
import MicroservicesTab from './components/MicroservicesTab';
import TechnologiesTab from './components/TechnologiesTab';
import DependenciesTab from './components/DependenciesTab';
import APIsTab from './components/APIsTab';
import InfrastructureTab from './components/InfrastructureTab';
import RepositoryActivityTab from './components/RepositoryActivityTab';
import ImagesTab from './components/ImagesTab';
import BaseImagesTab from './components/BaseImagesTab';
import SecurityTab from './components/SecurityTab';
import OpenSourceSecurityTab from './components/OpenSourceSecurityTab';
import BaseImageManagementTab from './components/BaseImageManagementTab';
import NewCodeInventory from './components/NewCodeInventory';
import NewImageInventory from './components/NewImageInventory';
import ServiceOwnerWorkspace from './components/ServiceOwnerWorkspace';

import { FaShieldAlt, FaCode, FaLaptopCode, FaLayerGroup, FaServer, FaNetworkWired, FaGithub, FaDocker, FaCubes, FaUserTie } from 'react-icons/fa';
import './components/LeftPanel.css';



// Centralized function to process all data and calculate metrics
const processDashboardData = (inventory, activity, image) => {
  const get = (obj, path, defaultValue = 0) => {
    if (!obj) return defaultValue;
    const value = path.split('.').reduce((acc, key) => acc && acc[key], obj);
    return value === undefined || value === null ? defaultValue : value;
  };

  const services = get(inventory, 'services.services', []);
  const languages = get(inventory, 'technologies.languages', {});
  const dependencies = get(inventory, 'dependencies', {});
  const apis = get(inventory, 'apis.endpoints', []);
  const summary = get(activity, 'summary', {});
  const images = get(image, 'images', []);
  const imageInfra = get(image, 'infrastructure', {});

  const packagesCount = images.reduce((acc, img) => acc + get(img, 'packages.length', 0), 0);

  return {
    microservicesCount: services.length,
    languagesCount: Object.keys(languages).length,
    dependenciesCount: get(dependencies, 'total_count'),
    apisCount: apis.length,
    pullRequestsCount: get(summary, 'total_pull_requests'),
    commitsCount: get(summary, 'total_commits'),
    imagesCount: images.length,
    packagesCount: packagesCount,
    clustersCount: get(imageInfra, 'clusters'),
    nodesCount: get(imageInfra, 'nodes'),
    namespacesCount: get(imageInfra, 'namespaces'),
  };
};

function App() {
  const [activeTab, setActiveTab] = useState('microservices');
  const [activeSection, setActiveSection] = useState('main');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    microservicesCount: 12,
    languagesCount: 5,
    dependenciesCount: 42,
    apisCount: 18,
    pullRequestsCount: 7,
    commitsCount: 250,
    imagesCount: 12,
    packagesCount: 36,
    clustersCount: 2,
    nodesCount: 6,
    namespacesCount: 3
  });
  const [inventoryData, setInventoryData] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [securityData, setSecurityData] = useState(null);
  const [opensourceData, setOpensourceData] = useState(null);
  const [baseImageData, setBaseImageData] = useState(null);
  const [technologiesData, setTechnologiesData] = useState(null);
  const [dependenciesData, setDependenciesData] = useState(null);

  const fetchData = () => {
    setIsLoading(true);
    const fetchWithCacheBust = (url) => fetch(`${url}?t=${new Date().getTime()}`);

    Promise.all([
      fetchWithCacheBust('/data/microservices_inventory.json').then(res => res.json()),
      fetchWithCacheBust('/data/repo_activity_summary.json').then(res => res.json()),
      fetchWithCacheBust('/data/image_inventory.json').then(res => res.json()),
      fetchWithCacheBust('/data/security_findings.json').then(res => res.json()).catch(() => null),
      fetchWithCacheBust('/data/opensource_security.json').then(res => res.json()).catch(() => null),
      fetchWithCacheBust('/data/base_images_data.json').then(res => res.json()).catch(() => null),
      fetchWithCacheBust('/data/technologies_data.json').then(res => res.json()).catch(() => null),
      fetchWithCacheBust('/data/dependencies_data.json').then(res => res.json()).catch(() => null)
    ])
    .then(([inventory, activity, images, security, opensource, baseImages, technologies, dependencies]) => {
      // Set raw data for other tabs
      setInventoryData(inventory);
      setActivityData(activity);
      setImageData(images);
      setSecurityData(security);
      setOpensourceData(opensource);
      setBaseImageData(baseImages);
      setTechnologiesData(technologies);
      setDependenciesData(dependencies);

      // Process and set metrics for the inventory components
      const metrics = processDashboardData(inventory, activity, images, security);
      console.log('Dashboard Metrics:', metrics);
      setDashboardMetrics(metrics);
    })
    .catch(error => {
      console.error("Failed to fetch dashboard data:", error);
      // Optionally set to empty/default data on error
      setInventoryData({ services: { services: [] }, technologies: { languages: {} }, dependencies: {}, apis: { endpoints: [] } });
      setActivityData({ summary: {} });
      setImageData({ images: [], infrastructure: {} });
      setSecurityData(null);
      setOpensourceData(null);
      setBaseImageData(null);
      setTechnologiesData(null);
      setDependenciesData(null);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading || !inventoryData || !activityData || !imageData) {
    return (
      <Container>
        <div className="text-center my-5">
          <h2>Loading dashboard data...</h2>
        </div>
      </Container>
    );
  }

  // Ensure all required data is available


  const repository = inventoryData?.repository || {};
  const baseImageInsights = baseImageData || imageData?.baseImageInsights || {};
  


  const renderMainContent = () => {
    return (
      <Tab.Container id="dashboard-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row>
          <Col>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="microservices">Microservices</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="technologies">Technologies</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="dependencies">Dependencies</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="apis">APIs</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="infrastructure">Infrastructure</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="activity">Repository Activity</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="images">Images</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="base-images">Base Images</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col>
            <Tab.Content>
              <Tab.Pane eventKey="microservices">
                <MicroservicesTab services={inventoryData.services.services} />
              </Tab.Pane>
              <Tab.Pane eventKey="technologies">
                <TechnologiesTab technologies={technologiesData || inventoryData.technologies} />
              </Tab.Pane>
              <Tab.Pane eventKey="dependencies">
                <DependenciesTab dependencies={dependenciesData || inventoryData.dependencies} />
              </Tab.Pane>
              <Tab.Pane eventKey="apis">
                <APIsTab apis={inventoryData.apis} />
              </Tab.Pane>
              <Tab.Pane eventKey="infrastructure">
                <InfrastructureTab infrastructure={inventoryData.infrastructure} />
              </Tab.Pane>
              <Tab.Pane eventKey="activity">
                <RepositoryActivityTab activityData={activityData} />
              </Tab.Pane>
              <Tab.Pane eventKey="images">
                <ImagesTab images={imageData.images} />
              </Tab.Pane>
              <Tab.Pane eventKey="base-images">
                <BaseImagesTab images={imageData.images} baseImageInsights={baseImageInsights} />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
  };

  const renderSecurityContent = () => {
    if (activeSection === 'security') {
      return <SecurityTab securityData={securityData} />;
    } else if (activeSection === 'opensource-security') {
      return <OpenSourceSecurityTab opensourceData={opensourceData} dependencies={inventoryData.dependencies} />;
    } else if (activeSection === 'base-image-management') {
      return <BaseImageManagementTab baseImageInsights={baseImageInsights} images={imageData?.images || []} />;
    }
    return null;
  };

  return (
    <div className="App">
      <Header 
        repositoryName={repository.full_name || 'Repository'} 
        repositoryDescription={repository.description || ''}
        analysisTimestamp={inventoryData.analysis_timestamp || new Date().toISOString()}
        onRefresh={fetchData}
        isLoading={isLoading}
      />
      
      <Container fluid>
        {/* New components with redesigned metric cards */}
        <NewCodeInventory {...dashboardMetrics} />
        <NewImageInventory {...dashboardMetrics} />
        
        <div className="dashboard-container">
          <div className="left-panel">
            <div className="section-title">Main</div>
            <Nav variant="pills" className="flex-column" activeKey={activeSection} onSelect={(k) => setActiveSection(k)}>
              <Nav.Link eventKey="main" onClick={() => setActiveSection('main')}>
                <span className="nav-icon"><FaLaptopCode /></span>
                Dashboard
              </Nav.Link>
            </Nav>
            
            <div className="section-title">Security</div>
            <Nav variant="pills" className="flex-column" activeKey={activeSection} onSelect={(k) => setActiveSection(k)}>
              <Nav.Link eventKey="security" onClick={() => setActiveSection('security')}>
                <span className="nav-icon"><FaShieldAlt /></span>
                Security
              </Nav.Link>
              <Nav.Link eventKey="opensource-security" onClick={() => setActiveSection('opensource-security')}>
                <span className="nav-icon"><FaCode /></span>
                Open Source Security
              </Nav.Link>
              <Nav.Link eventKey="base-image-management" onClick={() => setActiveSection('base-image-management')}>
                <span className="nav-icon"><FaDocker /></span>
                Base Image Management
              </Nav.Link>
            </Nav>
          </div>
          
          <div className="main-content">
            {activeSection === 'main' ? renderMainContent() : renderSecurityContent()}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;
