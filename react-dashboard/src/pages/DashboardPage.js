import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import App from '../App';

const DashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
    }
  }, [navigate]);

  return <App />;
};

export default DashboardPage;
