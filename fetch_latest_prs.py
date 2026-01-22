#!/usr/bin/env python3
"""
Fetch Repository Activity Summary

This script fetches:
1. Total count of pull requests
2. Total count of commits
3. Detailed information for the last 5 pull requests
4. Commits associated with each of these pull requests
5. Owners for each PR and commit
6. Files changed in each commit

All data is from the GoogleCloudPlatform/microservices-demo repository.
"""

import os
import json
import requests
from datetime import datetime
import time

# GitHub API configuration
GITHUB_API_URL = "https://api.github.com"
REPO_OWNER = "GoogleCloudPlatform"
REPO_NAME = "microservices-demo"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")

# Optional: GitHub token for higher rate limits
# Set your token as an environment variable: export GITHUB_TOKEN="your_token"
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")

def get_headers():
    """Get headers for GitHub API requests"""
    headers = {
        "Accept": "application/vnd.github.v3+json"
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    return headers

def fetch_latest_pull_requests(count=5):
    """Fetch the latest pull requests from the repository"""
    print(f"Fetching latest {count} pull requests from {REPO_OWNER}/{REPO_NAME}...")
    
    url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/pulls"
    params = {
        "state": "all",
        "sort": "updated",
        "direction": "desc",
        "per_page": count
    }
    
    response = requests.get(url, headers=get_headers(), params=params)
    
    if response.status_code != 200:
        print(f"Error fetching pull requests: {response.status_code}")
        print(response.text)
        return []
    
    pull_requests = response.json()
    print(f"Fetched {len(pull_requests)} pull requests")
    return pull_requests

def fetch_pull_request_commits(pr_number):
    """Fetch commits associated with a pull request"""
    print(f"Fetching commits for PR #{pr_number}...")
    
    url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/pulls/{pr_number}/commits"
    response = requests.get(url, headers=get_headers())
    
    if response.status_code != 200:
        print(f"Error fetching commits for PR #{pr_number}: {response.status_code}")
        return []
    
    commits = response.json()
    print(f"Fetched {len(commits)} commits for PR #{pr_number}")
    return commits

def fetch_pull_request_files(pr_number):
    """Fetch files changed in a pull request"""
    print(f"Fetching files for PR #{pr_number}...")
    
    url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/pulls/{pr_number}/files"
    response = requests.get(url, headers=get_headers())
    
    if response.status_code != 200:
        print(f"Error fetching files for PR #{pr_number}: {response.status_code}")
        return []
    
    files = response.json()
    print(f"Fetched {len(files)} files for PR #{pr_number}")
    return files

def process_pull_requests(pull_requests):
    """Process pull requests to extract detailed information"""
    print("Processing pull request details...")
    
    pr_details = []
    
    for pr in pull_requests:
        pr_number = pr["number"]
        
        # Get PR commits
        commits = fetch_pull_request_commits(pr_number)
        
        # Get PR files
        files = fetch_pull_request_files(pr_number)
        
        # Create PR info object
        pr_info = {
            "number": pr_number,
            "title": pr["title"],
            "state": pr["state"],
            "created_at": pr["created_at"],
            "updated_at": pr["updated_at"],
            "closed_at": pr["closed_at"],
            "merged_at": pr["merged_at"],
            "user": {
                "login": pr["user"]["login"],
                "avatar_url": pr["user"]["avatar_url"],
                "html_url": pr["user"]["html_url"]
            },
            "html_url": pr["html_url"],
            "body": pr["body"],
            "commits": [
                {
                    "sha": commit["sha"],
                    "message": commit["commit"]["message"],
                    "author": {
                        "name": commit["commit"]["author"]["name"],
                        "email": commit["commit"]["author"]["email"],
                        "date": commit["commit"]["author"]["date"]
                    },
                    "committer": {
                        "name": commit["commit"]["committer"]["name"],
                        "email": commit["commit"]["committer"]["email"],
                        "date": commit["commit"]["committer"]["date"]
                    }
                }
                for commit in commits
            ],
            "files": [
                {
                    "filename": file["filename"],
                    "status": file["status"],
                    "additions": file["additions"],
                    "deletions": file["deletions"],
                    "changes": file["changes"]
                }
                for file in files
            ],
            "commit_count": len(commits),
            "file_count": len(files)
        }
        
        pr_details.append(pr_info)
        
        # Respect GitHub API rate limits
        time.sleep(1)
    
    print(f"Processed {len(pr_details)} pull requests with details")
    return pr_details

def fetch_total_pr_count():
    """Fetch the total count of pull requests in the repository"""
    print(f"Fetching total pull request count for {REPO_OWNER}/{REPO_NAME}...")
    
    url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/pulls"
    params = {
        "state": "all",
        "per_page": 1
    }
    
    try:
        response = requests.get(url, headers=get_headers(), params=params)
        
        if response.status_code != 200:
            print(f"Error fetching pull requests: {response.status_code}")
            return 0
        
        # Get total count from Link header
        if 'Link' in response.headers:
            link_header = response.headers['Link']
            if 'rel="last"' in link_header:
                last_page_url = [link.split(';')[0].strip('<>') for link in link_header.split(',') if 'rel="last"' in link][0]
                last_page = int(last_page_url.split('page=')[1].split('&')[0])
                return last_page
        
        # If no Link header or no last page, make another request to count
        params['per_page'] = 100
        response = requests.get(url, headers=get_headers(), params=params)
        if response.status_code == 200:
            return len(response.json())
        
        return 0
    except Exception as e:
        print(f"Error fetching total PR count: {e}")
        return 0

def fetch_total_commit_count():
    """Fetch the total count of commits in the repository"""
    print(f"Fetching total commit count for {REPO_OWNER}/{REPO_NAME}...")
    
    url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/commits"
    params = {
        "per_page": 1
    }
    
    try:
        response = requests.get(url, headers=get_headers(), params=params)
        
        if response.status_code != 200:
            print(f"Error fetching commits: {response.status_code}")
            return 0
        
        # Get total count from Link header
        if 'Link' in response.headers:
            link_header = response.headers['Link']
            if 'rel="last"' in link_header:
                last_page_url = [link.split(';')[0].strip('<>') for link in link_header.split(',') if 'rel="last"' in link][0]
                last_page = int(last_page_url.split('page=')[1].split('&')[0])
                return last_page
        
        # If no Link header or no last page, make another request to count
        params['per_page'] = 100
        response = requests.get(url, headers=get_headers(), params=params)
        if response.status_code == 200:
            return len(response.json())
        
        return 0
    except Exception as e:
        print(f"Error fetching total commit count: {e}")
        return 0

def main():
    """Main function to fetch and process repository activity"""
    print(f"Starting to fetch repository activity for {REPO_OWNER}/{REPO_NAME}...")
    
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Fetch total PR count
    total_pr_count = fetch_total_pr_count()
    print(f"Total pull requests: {total_pr_count}")
    
    # Fetch total commit count
    total_commit_count = fetch_total_commit_count()
    print(f"Total commits: {total_commit_count}")
    
    # Fetch latest pull requests
    pull_requests = fetch_latest_pull_requests(count=5)
    
    if not pull_requests:
        print("No pull requests found or error occurred.")
        return
    
    # Process pull request details
    pr_details = process_pull_requests(pull_requests)
    
    # Count total commits in the last 5 PRs
    total_pr_commits = sum(pr['commit_count'] for pr in pr_details)
    print(f"Total commits in the last 5 PRs: {total_pr_commits}")
    
    # Create result object
    result = {
        "repository": {
            "owner": REPO_OWNER,
            "name": REPO_NAME,
            "full_name": f"{REPO_OWNER}/{REPO_NAME}"
        },
        "summary": {
            "total_pull_requests": total_pr_count,
            "total_commits": total_commit_count,
            "latest_pr_count": len(pr_details),
            "latest_pr_commits": total_pr_commits
        },
        "pull_requests": {
            "count": len(pr_details),
            "details": pr_details
        },
        "timestamp": datetime.now().isoformat()
    }
    
    # Save results
    pr_json_path = os.path.join(OUTPUT_DIR, "repo_activity_summary.json")
    with open(pr_json_path, 'w') as f:
        json.dump(result, f, indent=2, default=str)
    
    print(f"Repository activity summary saved to: {pr_json_path}")
    
    # Generate a simple HTML report
    html_report_path = os.path.join(OUTPUT_DIR, "repo_activity_report.html")
    generate_html_report(result, html_report_path)
    
    print(f"HTML report generated at: {html_report_path}")

def generate_html_report(data, output_path):
    """Generate a simple HTML report for the repository activity"""
    # Generate HTML for pull requests
    pr_html = ""
    for pr in data['pull_requests']['details']:
        # Generate HTML for commits
        commits_html = ""
        for commit in pr['commits']:
            commits_html += f"""
            <div class="commit-item">
                <p><strong>Message:</strong> {commit['message']}</p>
                <p><strong>Author:</strong> {commit['author']['name']} ({commit['author']['email']})</p>
                <p><strong>Date:</strong> {commit['author']['date']}</p>
            </div>
            """
        
        # Generate HTML for files
        files_html = ""
        for file in pr['files']:
            files_html += f"""
            <div class="file-item">
                <p>
                    <strong>{file['filename']}</strong> 
                    <span class="badge badge-additions">+{file['additions']}</span> 
                    <span class="badge badge-deletions">-{file['deletions']}</span>
                    <span class="badge bg-secondary">{file['status']}</span>
                </p>
            </div>
            """
        
        # Generate HTML for the PR
        state_class = "open" if pr['state'] == "open" else "merged" if pr['merged_at'] else "closed"
        pr_html += f"""
        <div class="col-12">
            <div class="pr-card">
                <div class="pr-header d-flex justify-content-between">
                    <h3>#{pr['number']} - {pr['title']}</h3>
                    <span class="state-{state_class}">{pr['state'].upper()}</span>
                </div>
                <div class="pr-body">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <p><strong>Author:</strong> {pr['user']['login']}</p>
                            <p><strong>Created:</strong> {pr['created_at']}</p>
                            <p><strong>Updated:</strong> {pr['updated_at']}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Commits:</strong> {pr['commit_count']}</p>
                            <p><strong>Files Changed:</strong> {pr['file_count']}</p>
                            <p><a href="{pr['html_url']}" target="_blank" class="btn btn-sm btn-primary">View on GitHub</a></p>
                        </div>
                    </div>
                    
                    <h4>Commits ({pr['commit_count']})</h4>
                    <div class="commits-list mb-3">
                        {commits_html}
                    </div>
                    
                    <h4>Files Changed ({pr['file_count']})</h4>
                    <div class="files-list">
                        {files_html}
                    </div>
                </div>
            </div>
        </div>
        """
    
    # Create the full HTML content
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Repository Activity - {data['repository']['full_name']}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; }}
        .header {{ background-color: #343a40; color: white; padding: 20px; margin-bottom: 20px; border-radius: 5px; }}
        .summary-card {{ background-color: #f8f9fa; padding: 20px; margin-bottom: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }}
        .summary-item {{ text-align: center; padding: 15px; }}
        .summary-value {{ font-size: 24px; font-weight: bold; color: #007bff; }}
        .summary-label {{ font-size: 14px; color: #6c757d; }}
        .pr-card {{ margin-bottom: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }}
        .pr-header {{ background-color: #007bff; color: white; padding: 10px; border-radius: 5px 5px 0 0; }}
        .pr-body {{ padding: 15px; }}
        .commit-item {{ padding: 10px; border-bottom: 1px solid #eee; }}
        .commit-item:last-child {{ border-bottom: none; }}
        .file-item {{ padding: 5px; border-bottom: 1px solid #eee; }}
        .file-item:last-child {{ border-bottom: none; }}
        .badge-additions {{ background-color: #28a745; color: white; }}
        .badge-deletions {{ background-color: #dc3545; color: white; }}
        .state-open {{ background-color: #28a745; color: white; padding: 3px 8px; border-radius: 3px; }}
        .state-closed {{ background-color: #dc3545; color: white; padding: 3px 8px; border-radius: 3px; }}
        .state-merged {{ background-color: #6f42c1; color: white; padding: 3px 8px; border-radius: 3px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Repository Activity Summary</h1>
            <p>Repository: {data['repository']['full_name']}</p>
            <p>Generated: {data['timestamp']}</p>
        </div>
        
        <div class="summary-card">
            <h2>Activity Summary</h2>
            <div class="row">
                <div class="col-md-3">
                    <div class="summary-item">
                        <div class="summary-value">{data['summary']['total_pull_requests']}</div>
                        <div class="summary-label">Total Pull Requests</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="summary-item">
                        <div class="summary-value">{data['summary']['total_commits']}</div>
                        <div class="summary-label">Total Commits</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="summary-item">
                        <div class="summary-value">{data['summary']['latest_pr_count']}</div>
                        <div class="summary-label">Latest PRs Analyzed</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="summary-item">
                        <div class="summary-value">{data['summary']['latest_pr_commits']}</div>
                        <div class="summary-label">Commits in Latest PRs</div>
                    </div>
                </div>
            </div>
        </div>
        
        <h2>Latest Pull Requests</h2>
        <div class="row">
            {pr_html}
        </div>
    </div>
</body>
</html>
    """
    
    with open(output_path, 'w') as f:
        f.write(html_content)

if __name__ == "__main__":
    main()
