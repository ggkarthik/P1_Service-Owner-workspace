#!/usr/bin/env python3
"""
Fetch Repository Activity

This script fetches pull requests, commits, and associated file information
from the GoogleCloudPlatform/microservices-demo repository.
"""

import os
import json
import requests
from datetime import datetime
import time
from collections import defaultdict

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

def fetch_pull_requests(state="all", per_page=100, max_pages=5):
    """Fetch pull requests from the repository"""
    print(f"Fetching pull requests from {REPO_OWNER}/{REPO_NAME}...")
    
    pull_requests = []
    page = 1
    
    while page <= max_pages:
        url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/pulls"
        params = {
            "state": state,
            "per_page": per_page,
            "page": page
        }
        
        response = requests.get(url, headers=get_headers(), params=params)
        
        if response.status_code != 200:
            print(f"Error fetching pull requests: {response.status_code}")
            print(response.text)
            break
        
        page_prs = response.json()
        pull_requests.extend(page_prs)
        
        if len(page_prs) < per_page:
            break
        
        page += 1
        # Respect GitHub API rate limits
        time.sleep(1)
    
    print(f"Fetched {len(pull_requests)} pull requests")
    return pull_requests

def fetch_pull_request_details(pr_number):
    """Fetch detailed information about a specific pull request"""
    url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/pulls/{pr_number}"
    response = requests.get(url, headers=get_headers())
    
    if response.status_code != 200:
        print(f"Error fetching PR #{pr_number}: {response.status_code}")
        return None
    
    return response.json()

def fetch_pull_request_commits(pr_number):
    """Fetch commits associated with a pull request"""
    url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/pulls/{pr_number}/commits"
    response = requests.get(url, headers=get_headers())
    
    if response.status_code != 200:
        print(f"Error fetching commits for PR #{pr_number}: {response.status_code}")
        return []
    
    return response.json()

def fetch_pull_request_files(pr_number):
    """Fetch files changed in a pull request"""
    url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/pulls/{pr_number}/files"
    response = requests.get(url, headers=get_headers())
    
    if response.status_code != 200:
        print(f"Error fetching files for PR #{pr_number}: {response.status_code}")
        return []
    
    return response.json()

def fetch_repository_commits(per_page=100, max_pages=5):
    """Fetch commits from the repository"""
    print(f"Fetching commits from {REPO_OWNER}/{REPO_NAME}...")
    
    commits = []
    page = 1
    
    while page <= max_pages:
        url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/commits"
        params = {
            "per_page": per_page,
            "page": page
        }
        
        response = requests.get(url, headers=get_headers(), params=params)
        
        if response.status_code != 200:
            print(f"Error fetching commits: {response.status_code}")
            print(response.text)
            break
        
        page_commits = response.json()
        commits.extend(page_commits)
        
        if len(page_commits) < per_page:
            break
        
        page += 1
        # Respect GitHub API rate limits
        time.sleep(1)
    
    print(f"Fetched {len(commits)} commits")
    return commits

def fetch_commit_details(commit_sha):
    """Fetch detailed information about a specific commit"""
    url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/commits/{commit_sha}"
    response = requests.get(url, headers=get_headers())
    
    if response.status_code != 200:
        print(f"Error fetching commit {commit_sha}: {response.status_code}")
        return None
    
    return response.json()

def process_pull_requests(pull_requests, max_details=30):
    """Process pull requests to extract detailed information"""
    print(f"Processing pull request details (max: {max_details})...")
    
    pr_details = []
    count = 0
    
    for pr in pull_requests[:max_details]:
        pr_number = pr["number"]
        print(f"Processing PR #{pr_number}...")
        
        # Get PR details
        details = fetch_pull_request_details(pr_number)
        if not details:
            continue
        
        # Get PR commits
        commits = fetch_pull_request_commits(pr_number)
        
        # Get PR files
        files = fetch_pull_request_files(pr_number)
        
        # Create PR info object
        pr_info = {
            "number": pr_number,
            "title": details["title"],
            "state": details["state"],
            "created_at": details["created_at"],
            "updated_at": details["updated_at"],
            "closed_at": details["closed_at"],
            "merged_at": details["merged_at"],
            "user": {
                "login": details["user"]["login"],
                "avatar_url": details["user"]["avatar_url"],
                "html_url": details["user"]["html_url"]
            },
            "html_url": details["html_url"],
            "body": details["body"],
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
        count += 1
        
        # Respect GitHub API rate limits
        time.sleep(1)
    
    print(f"Processed {count} pull requests with details")
    return pr_details

def analyze_repository_activity(pr_details, commits):
    """Analyze repository activity to generate statistics"""
    print("Analyzing repository activity...")
    
    # Initialize statistics
    stats = {
        "pull_requests": {
            "total": len(pr_details),
            "open": sum(1 for pr in pr_details if pr["state"] == "open"),
            "closed": sum(1 for pr in pr_details if pr["state"] == "closed"),
            "merged": sum(1 for pr in pr_details if pr["merged_at"] is not None),
            "by_author": defaultdict(int),
            "by_file": defaultdict(int),
            "by_month": defaultdict(int)
        },
        "commits": {
            "total": len(commits),
            "by_author": defaultdict(int),
            "by_month": defaultdict(int)
        }
    }
    
    # Analyze pull requests
    for pr in pr_details:
        # Count by author
        author = pr["user"]["login"]
        stats["pull_requests"]["by_author"][author] += 1
        
        # Count by month
        if pr["created_at"]:
            month = pr["created_at"][:7]  # Format: YYYY-MM
            stats["pull_requests"]["by_month"][month] += 1
        
        # Count by file
        for file in pr["files"]:
            stats["pull_requests"]["by_file"][file["filename"]] += 1
    
    # Analyze commits
    for commit in commits:
        # Count by author
        if "author" in commit and commit["author"]:
            author = commit["author"]["login"] if commit["author"] else "Unknown"
        else:
            author = "Unknown"
        stats["commits"]["by_author"][author] += 1
        
        # Count by month
        if "commit" in commit and "author" in commit["commit"] and "date" in commit["commit"]["author"]:
            month = commit["commit"]["author"]["date"][:7]  # Format: YYYY-MM
            stats["commits"]["by_month"][month] += 1
    
    # Convert defaultdicts to regular dicts for JSON serialization
    stats["pull_requests"]["by_author"] = dict(stats["pull_requests"]["by_author"])
    stats["pull_requests"]["by_file"] = dict(stats["pull_requests"]["by_file"])
    stats["pull_requests"]["by_month"] = dict(stats["pull_requests"]["by_month"])
    stats["commits"]["by_author"] = dict(stats["commits"]["by_author"])
    stats["commits"]["by_month"] = dict(stats["commits"]["by_month"])
    
    print("Repository activity analysis complete")
    return stats

def main():
    """Main function to fetch and process repository activity"""
    print(f"Starting repository activity analysis for {REPO_OWNER}/{REPO_NAME}...")
    
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Fetch pull requests
    pull_requests = fetch_pull_requests(max_pages=3)
    
    # Process pull request details (limit to 30 for API rate limits)
    pr_details = process_pull_requests(pull_requests, max_details=30)
    
    # Fetch commits
    commits = fetch_repository_commits(max_pages=3)
    
    # Analyze repository activity
    stats = analyze_repository_activity(pr_details, commits)
    
    # Create result object
    result = {
        "repository": {
            "owner": REPO_OWNER,
            "name": REPO_NAME,
            "full_name": f"{REPO_OWNER}/{REPO_NAME}"
        },
        "pull_requests": {
            "count": len(pull_requests),
            "details": pr_details
        },
        "commits": {
            "count": len(commits),
            "list": commits
        },
        "statistics": stats,
        "timestamp": datetime.now().isoformat()
    }
    
    # Save results
    pr_json_path = os.path.join(OUTPUT_DIR, "pull_requests.json")
    with open(pr_json_path, 'w') as f:
        json.dump(result["pull_requests"], f, indent=2)
    
    commits_json_path = os.path.join(OUTPUT_DIR, "commits.json")
    with open(commits_json_path, 'w') as f:
        json.dump(result["commits"], f, indent=2)
    
    stats_json_path = os.path.join(OUTPUT_DIR, "repo_statistics.json")
    with open(stats_json_path, 'w') as f:
        json.dump(result["statistics"], f, indent=2)
    
    summary_json_path = os.path.join(OUTPUT_DIR, "repo_activity_summary.json")
    with open(summary_json_path, 'w') as f:
        summary = {
            "repository": result["repository"],
            "pull_request_count": result["pull_requests"]["count"],
            "commit_count": result["commits"]["count"],
            "statistics": result["statistics"],
            "timestamp": result["timestamp"]
        }
        json.dump(summary, f, indent=2)
    
    print(f"Repository activity analysis complete!")
    print(f"Results saved to:")
    print(f"  - Pull Requests: {pr_json_path}")
    print(f"  - Commits: {commits_json_path}")
    print(f"  - Statistics: {stats_json_path}")
    print(f"  - Summary: {summary_json_path}")

if __name__ == "__main__":
    main()
