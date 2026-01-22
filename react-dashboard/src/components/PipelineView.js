import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { FaCode, FaDocker, FaCloud, FaArrowRight } from 'react-icons/fa';
import './PipelineView.css';

const PipelineView = ({ pipeline }) => {
  const getStageIcon = (type) => {
    switch (type) {
      case 'code':
        return <FaCode />;
      case 'container_repository':
        return <FaDocker />;
      case 'container_image':
        return <FaCloud />;
      default:
        return null;
    }
  };

  const getStageStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'active':
        return 'primary';
      case 'failed':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-0">{pipeline.name}</h6>
          <small className="text-muted">Commit: {pipeline.commit_sha.substring(0, 8)}</small>
        </div>
        <Badge bg={getStageStatus(pipeline.status)}>{pipeline.status}</Badge>
      </Card.Header>
      <Card.Body>
        <div className="pipeline-container">
          {pipeline.stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <div className="pipeline-stage">
                <div className={`stage-icon bg-${getStageStatus(stage.status)}`}>
                  {getStageIcon(stage.type)}
                </div>
                <div className="stage-details">
                  <div className="stage-name">{stage.name}</div>
                  <div className="stage-meta">
                    {stage.details.findings?.length > 0 && (
                      <Badge bg="warning" className="me-1">
                        {stage.details.findings.length} findings
                      </Badge>
                    )}
                    {stage.details.commit_sha && (
                      <code className="small">{stage.details.commit_sha.substring(0, 8)}</code>
                    )}
                  </div>
                </div>
              </div>
              {index < pipeline.stages.length - 1 && (
                <div className="pipeline-arrow">
                  <FaArrowRight />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="pipeline-metadata mt-3">
          <small className="text-muted">
            Triggered by: {pipeline.metadata.triggered_by} | 
            Branch: {pipeline.metadata.source_branch} | 
            Started: {new Date(pipeline.metadata.start_time).toLocaleString()}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PipelineView;
