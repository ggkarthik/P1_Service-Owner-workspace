import React from 'react';

const NewMetricCard = ({ value, label, icon, color = '#0d6efd' }) => {
  // Handle different value types
  let displayValue;
  if (value === undefined || value === null) {
    displayValue = 0;
  } else if (typeof value === 'string') {
    // Try to convert to number if it's a numeric string
    const parsed = parseFloat(value);
    displayValue = isNaN(parsed) ? value : parsed;
  } else {
    displayValue = value;
  }
  
  // Log the value for debugging
  console.log(`NewMetricCard ${label}:`, { raw: value, display: displayValue });
  
  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px 15px',
    margin: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: 'none',
    height: '100%',
    minHeight: '140px',
    position: 'relative',
    overflow: 'hidden',
    flex: '1 1 auto',
    width: '100%'
  };
  
  const valueStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: color,
    marginBottom: '5px',
    position: 'relative',
    zIndex: 2
  };
  
  const labelStyle = {
    fontSize: '1rem',
    color: '#495057',
    fontWeight: '500',
    textAlign: 'center',
    position: 'relative',
    zIndex: 2
  };
  
  const iconStyle = {
    position: 'absolute',
    bottom: '-15px',
    right: '-15px',
    fontSize: '5rem',
    color: `${color}15`, // Very light version of the color
    opacity: 0.7,
    zIndex: 1
  };
  
  const accentStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '5px',
    height: '100%',
    backgroundColor: color
  };
  
  return (
    <div style={cardStyle}>
      <div style={accentStyle}></div>
      {icon && <div style={iconStyle}>{icon}</div>}
      <div style={valueStyle}>{displayValue}</div>
      <div style={labelStyle}>{label}</div>
    </div>
  );
};

export default NewMetricCard;
