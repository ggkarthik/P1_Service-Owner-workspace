import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { Button } from 'react-bootstrap';
import { FaSync, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Header = ({ repositoryName, repositoryDescription, analysisTimestamp, onRefresh, isLoading }) => {
  const formattedDate = new Date(analysisTimestamp).toLocaleString();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };
  
  return (
    <div className="header">
      <Container>
        <Row>
          <Col md={6}>
            <div className="mb-2">
              <Logo size="small" variant="with-text" />
            </div>
            <p className="mb-1"><small>Repository: {repositoryName}</small></p>
            <p className="mb-0"><small>{repositoryDescription}</small></p>
          </Col>
          <Col md={6} className="text-end d-flex flex-column align-items-end justify-content-center">
            <div className="d-flex align-items-center gap-3 mb-2">
              <span className="text-light d-flex align-items-center">
                <FaUser className="me-2" />
                {userEmail}
              </span>
              <Button 
                variant="outline-light" 
                size="sm" 
                onClick={handleLogout}
                className="d-flex align-items-center"
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </Button>
            </div>
            <p className="mb-2">Analysis Date: {formattedDate}</p>
            <Button 
              variant="outline-light" 
              size="sm" 
              onClick={onRefresh} 
              disabled={isLoading}
              className="d-flex align-items-center"
            >
              <FaSync className={isLoading ? 'fa-spin' : ''} />
              <span className="ms-2">{isLoading ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Header;
