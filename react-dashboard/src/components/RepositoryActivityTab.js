import React, { useState } from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { FaChevronRight, FaChevronDown, FaCodeBranch, FaCode, FaFile, FaGitAlt, FaListAlt, FaHistory } from 'react-icons/fa';
import NewMetricCard from './NewMetricCard';

// Safe stringify function to handle any value
const safeStringify = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return String(value);
    }
  }
  return String(value);
};

// TreeItem component for the interactive tree structure
const TreeItem = ({ label, children, icon, initiallyOpen = false, badges = [] }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  
  return (
    <div className="tree-item">
      <div onClick={() => setIsOpen(!isOpen)} className="tree-toggle d-flex align-items-center">
        {children && (
          isOpen ? <FaChevronDown className="me-2" /> : <FaChevronRight className="me-2" />
        )}
        {icon && <span className="me-2">{icon}</span>}
        <span>{label}</span>
        {badges.map((badge, index) => (
          <Badge bg={badge.bg} className="ms-2" key={index}>{badge.text}</Badge>
        ))}
      </div>
      {isOpen && children && (
        <div className="tree-content">
          {children}
        </div>
      )}
    </div>
  );
};

// Pull Request component
const PullRequest = ({ pr }) => {
  // Add null checks for all PR properties
  if (!pr) return null;
  
  const number = pr.number || 0;
  const title = pr.title || 'Untitled PR';
  const state = pr.state || 'unknown';
  const user = pr.user || { login: 'unknown' };
  const created_at = pr.created_at || new Date().toISOString();
  const updated_at = pr.updated_at || new Date().toISOString();
  const closed_at = pr.closed_at;
  const merged_at = pr.merged_at;
  const commit_count = pr.commit_count || 0;
  const file_count = pr.file_count || 0;
  const html_url = pr.html_url || '#';
  const commits = pr.commits || [];
  const files = pr.files || [];
  
  const getStateClass = () => {
    if (state === 'open') return 'state-open';
    if (merged_at) return 'state-merged';
    return 'state-closed';
  };
  
  return (
    <div className="pr-item mb-3">
      <TreeItem 
        label={`#${number} - ${title}`}
        icon={<FaCodeBranch />}
        initiallyOpen={false}
        badges={[
          { bg: 'primary', text: user.login },
          { bg: state === 'open' ? 'success' : merged_at ? 'info' : 'danger', text: state.toUpperCase() }
        ]}
      >
        <div className="mb-2">
          <div><strong>Author:</strong> {user.login}</div>
          <div><strong>Created:</strong> {new Date(created_at).toLocaleString()}</div>
          <div><strong>Updated:</strong> {new Date(updated_at).toLocaleString()}</div>
          {closed_at && <div><strong>Closed:</strong> {new Date(closed_at).toLocaleString()}</div>}
          {merged_at && <div><strong>Merged:</strong> {new Date(merged_at).toLocaleString()}</div>}
          <div><strong>Commits:</strong> {commit_count}</div>
          <div><strong>Files Changed:</strong> {file_count}</div>
          <div className="mt-2">
            <a href={html_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
              View on GitHub
            </a>
          </div>
        </div>
        
        <TreeItem 
          label={`Commits (${commit_count})`}
          icon={<FaCode />}
          initiallyOpen={false}
        >
          {commits.map((commit, index) => {
            // Add null checks for commit properties
            if (!commit) return null;
            const message = commit.message || 'No message';
            const author = commit.author || { name: 'Unknown', email: 'unknown', date: new Date().toISOString() };
            
            return (
              <div key={index} className="commit-item">
                <TreeItem 
                  label={message}
                  initiallyOpen={false}
                  badges={[
                    { bg: 'secondary', text: author.name }
                  ]}
                >
                  <div><strong>Author:</strong> {author.name} ({author.email})</div>
                  <div><strong>Date:</strong> {new Date(author.date).toLocaleString()}</div>
                </TreeItem>
              </div>
            );
          })}
        </TreeItem>
        
        <TreeItem 
          label={`Files Changed (${file_count})`}
          icon={<FaFile />}
          initiallyOpen={false}
        >
          {files.map((file, index) => {
            // Add null checks for file properties
            if (!file) return null;
            const filename = file.filename || 'Unknown file';
            const additions = file.additions || 0;
            const deletions = file.deletions || 0;
            const status = file.status || 'modified';
            
            return (
              <div key={index} className="file-item">
                <div>
                  <strong>{filename}</strong>
                  <span className="badge-additions ms-2">+{additions}</span>
                  <span className="badge-deletions">-{deletions}</span>
                  <Badge bg="secondary" className="ms-2">{status}</Badge>
                </div>
              </div>
            );
          })}
        </TreeItem>
      </TreeItem>
    </div>
  );
};

const RepositoryActivityTab = ({ activityData }) => {
  // Add null checks and handle the actual data structure
  const statistics = activityData?.statistics || {};
  const pull_requests_stats = statistics?.pull_requests || {};
  const commits_stats = statistics?.commits || {};
  
  // Create a summary object with the metrics we need
  const summary = {
    total_pull_requests: pull_requests_stats?.total || 0,
    total_commits: commits_stats?.total || 0,
    latest_pr_count: activityData?.pull_requests?.details?.length || 0,
    latest_pr_commits: activityData?.pull_requests?.details?.reduce((total, pr) => total + (pr?.commits?.length || 0), 0) || 0
  };
  
  const pull_requests = activityData?.pull_requests || { count: 0, details: [] };
  
  return (
    <div>
      <h2 className="mb-4">Repository Activity</h2>
      
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>Activity Summary</Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <NewMetricCard
                    value={safeStringify(summary.total_pull_requests)}
                    label="Total Pull Requests"
                    icon={<FaCodeBranch />}
                    color="#6c757d"
                  />
                </Col>
                <Col md={3}>
                  <NewMetricCard
                    value={safeStringify(summary.total_commits)}
                    label="Total Commits"
                    icon={<FaGitAlt />}
                    color="#0d6efd"
                  />
                </Col>
                <Col md={3}>
                  <NewMetricCard
                    value={safeStringify(summary.latest_pr_count)}
                    label="Latest PRs Analyzed"
                    icon={<FaListAlt />}
                    color="#20c997"
                  />
                </Col>
                <Col md={3}>
                  <NewMetricCard
                    value={safeStringify(summary.latest_pr_commits)}
                    label="Commits in Latest PRs"
                    icon={<FaHistory />}
                    color="#fd7e14"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card>
        <Card.Header>Pull Requests</Card.Header>
        <Card.Body>
          <div className="tree-view">
            {(pull_requests.details || []).map((pr, index) => (
              <PullRequest key={index} pr={pr} />
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RepositoryActivityTab;
