import React from 'react';
import { Card, Table } from 'react-bootstrap';

const APIsTab = ({ apis }) => {
  // Add null checks
  const endpoints = apis?.endpoints || [];
  const rest_apis = apis?.rest_apis || [];
  const grpc_services = apis?.grpc_services || [];
  
  return (
    <div>
      <h2 className="mb-4">APIs</h2>
      
      <Card className="mb-4">
        <Card.Header>API Endpoints</Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Path</th>
                <th>Method</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((api, index) => (
                <tr key={index}>
                  <td>{api.path}</td>
                  <td>{api.method}</td>
                  <td>{api.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      
      {rest_apis && rest_apis.length > 0 && (
        <Card className="mb-4">
          <Card.Header>REST APIs</Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Path</th>
                  <th>Method</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {rest_apis.map((api, index) => (
                  <tr key={index}>
                    <td>{api.path}</td>
                    <td>{api.method}</td>
                    <td>{api.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
      
      {grpc_services && grpc_services.length > 0 && (
        <Card>
          <Card.Header>gRPC Services</Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Path</th>
                  <th>Method</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {grpc_services.map((api, index) => (
                  <tr key={index}>
                    <td>{api.path}</td>
                    <td>{api.method}</td>
                    <td>{api.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default APIsTab;
