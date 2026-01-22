import React from 'react';
import './MetricCard.css';

const MetricCard = ({ value, label }) => {
  // Ensure value is always a valid number
  const displayValue = value !== undefined && value !== null ? Number(value) : 0;
  
  // Log the value for debugging
  console.log(`MetricCard ${label}:`, { raw: value, display: displayValue });
  
  return (
    <div className="metric-card">
      <div className="metric-value">{displayValue}</div>
      <div className="metric-label">{label}</div>
    </div>
  );
};

export default MetricCard;
