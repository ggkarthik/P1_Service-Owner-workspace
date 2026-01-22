import React from 'react';
import { Alert } from 'react-bootstrap';
import SecurityFindings from './SecurityFindings';
import './SecurityTab.css';

const SecurityTab = ({ securityData }) => {
    // Check if we have the new format (array of services) or old format (with summary and services)
    const isNewFormat = Array.isArray(securityData);
    
    // If we have the new format, transform it to match what the component expects
    const transformedData = isNewFormat ? transformSecurityData(securityData) : securityData;
    
    // If no data or transformation failed, show alert
    if (!transformedData) {
        return (
            <Alert variant="info">
                No security findings data available. Run the security analysis to generate findings.
            </Alert>
        );
    }
    
    // Use SecurityFindings component for the transformed data
    return <SecurityFindings securityData={transformedData} />;
};

// Function to transform the new security data format to the expected format
const transformSecurityData = (servicesArray) => {
    if (!servicesArray || !Array.isArray(servicesArray) || servicesArray.length === 0) {
        return null;
    }
    
    // Calculate summary statistics
    let totalFindings = 0;
    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    const byType = {};
    const byService = {};
    const byStage = {};
    
    // Process each service
    servicesArray.forEach(service => {
        const serviceName = service.microservice;
        const findings = service.findings || [];
        byService[serviceName] = findings.length;
        totalFindings += findings.length;
        
        // Count by severity, type, and stage
        findings.forEach(finding => {
            // Count by severity
            switch(finding.severity) {
                case 'Critical': criticalCount++; break;
                case 'High': highCount++; break;
                case 'Medium': mediumCount++; break;
                case 'Low': lowCount++; break;
                default: break;
            }
            
            // Count by type
            byType[finding.type] = (byType[finding.type] || 0) + 1;
            
            // Count by stage
            byStage[finding.stage] = (byStage[finding.stage] || 0) + 1;
        });
    });
    
    // Create the transformed data structure
    return {
        summary: {
            total_findings: totalFindings,
            critical: criticalCount,
            high: highCount,
            medium: mediumCount,
            low: lowCount,
            by_type: byType,
            by_service: byService,
            by_stage: byStage
        },
        services: servicesArray.map(service => ({
            name: service.microservice,
            findings: service.findings || [],
            connected_findings: service.connected_findings || []
        }))
    };
};

export default SecurityTab;
