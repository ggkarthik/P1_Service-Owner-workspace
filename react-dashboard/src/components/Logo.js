import React from 'react';
import './Logo.css';

const Logo = ({ size = 'medium', variant = 'full' }) => {
  const sizeClasses = {
    small: 'logo-small',
    medium: 'logo-medium',
    large: 'logo-large',
    xlarge: 'logo-xlarge'
  };

  if (variant === 'icon') {
    return (
      <div className={`first-logo-icon ${sizeClasses[size]}`}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Hexagon shape */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#81B5A1', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#62D0CA', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#044E54', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          
          {/* Hexagon background */}
          <polygon 
            points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" 
            fill="url(#logoGradient)"
          />
          
          {/* Letter "F" stylized */}
          <path 
            d="M 35 30 L 65 30 L 65 38 L 45 38 L 45 45 L 60 45 L 60 53 L 45 53 L 45 70 L 35 70 Z" 
            fill="white"
            stroke="white"
            strokeWidth="1"
          />
          
          {/* Accent line */}
          <line x1="35" y1="75" x2="65" y2="75" stroke="#62D0CA" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`first-logo ${sizeClasses[size]}`}>
      <div className="logo-icon-wrapper">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#81B5A1', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#62D0CA', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#044E54', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          
          <polygon 
            points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" 
            fill="url(#logoGradient)"
          />
          
          <path 
            d="M 35 30 L 65 30 L 65 38 L 45 38 L 45 45 L 60 45 L 60 53 L 45 53 L 45 70 L 35 70 Z" 
            fill="white"
            stroke="white"
            strokeWidth="1"
          />
          
          <line x1="35" y1="75" x2="65" y2="75" stroke="#62D0CA" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <div className="logo-text">
        <span className="logo-name">First</span>
        {variant === 'full' && <span className="logo-tagline">Risk Intelligence</span>}
      </div>
    </div>
  );
};

export default Logo;
