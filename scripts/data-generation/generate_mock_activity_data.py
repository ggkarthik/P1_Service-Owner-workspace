#!/usr/bin/env python3
"""
Generate Mock Repository Activity Data

This script generates mock data for repository activity analysis
to demonstrate the dashboard functionality without relying on GitHub API.
"""

import os
import json
from datetime import datetime, timedelta
import random

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")

def generate_mock_pull_requests(count=100):
    """Generate mock pull requests data"""
    print(f"Generating {count} mock pull requests...")
    
    pull_requests = []
    pr_details = []
    
    # Common PR titles and descriptions
    titles = [
        "Update dependencies",
        "Fix bug in checkout service",
        "Add new feature to frontend",
        "Improve performance in cart service",
        "Update documentation",
        "Fix security vulnerability",
        "Add unit tests",
        "Refactor code",
        "Update Docker image",
        "Fix typo in README"
    ]
    
    # Common authors
    authors = [
        {"login": "renovate-bot", "avatar_url": "https://avatars.githubusercontent.com/u/25180681", "html_url": "https://github.com/renovate-bot"},
        {"login": "dependabot", "avatar_url": "https://avatars.githubusercontent.com/u/27347476", "html_url": "https://github.com/dependabot"},
        {"login": "googlebot", "avatar_url": "https://avatars.githubusercontent.com/u/19935", "html_url": "https://github.com/googlebot"},
        {"login": "developer1", "avatar_url": "https://avatars.githubusercontent.com/u/12345", "html_url": "https://github.com/developer1"},
        {"login": "developer2", "avatar_url": "https://avatars.githubusercontent.com/u/23456", "html_url": "https://github.com/developer2"},
        {"login": "developer3", "avatar_url": "https://avatars.githubusercontent.com/u/34567", "html_url": "https://github.com/developer3"}
    ]
    
    # Common files
    files = [
        "src/frontend/main.go",
        "src/cartservice/src/CartService.cs",
        "src/productcatalogservice/server.go",
        "src/checkoutservice/main.go",
        "src/paymentservice/index.js",
        "src/shippingservice/main.go",
        "src/currencyservice/server.js",
        "src/emailservice/email_server.py",
        "src/recommendationservice/recommendation_server.py",
        "src/adservice/src/main/java/hipstershop/AdService.java",
        "kubernetes-manifests/deployment.yaml",
        "skaffold.yaml",
        "README.md",
        "docker-compose.yaml",
        "requirements.txt",
        "package.json"
    ]
    
    # Generate pull requests
    for i in range(1, count + 1):
        pr_number = 3000 + i
        
        # Determine state and dates
        state = random.choice(["open", "closed"])
        created_at = (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat()
        updated_at = (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat()
        closed_at = (datetime.now() - timedelta(days=random.randint(0, 29))).isoformat() if state == "closed" else None
        merged_at = (datetime.now() - timedelta(days=random.randint(0, 28))).isoformat() if state == "closed" and random.random() > 0.3 else None
        
        # Select author
        author = random.choice(authors)
        
        # Generate PR data
        title = random.choice(titles)
        if "dependencies" in title.lower() and random.random() > 0.5:
            title += f" to v{random.randint(1, 10)}.{random.randint(0, 20)}.{random.randint(0, 99)}"
        
        # Generate commits
        commit_count = random.randint(1, 5)
        commits = []
        for j in range(commit_count):
            commit_message = title
            if j > 0:
                commit_message = f"Fix review comments for {title}"
            
            commit = {
                "sha": f"abc123def456{i}{j}",
                "message": commit_message,
                "author": {
                    "name": author["login"],
                    "email": f"{author['login']}@example.com",
                    "date": created_at
                },
                "committer": {
                    "name": author["login"],
                    "email": f"{author['login']}@example.com",
                    "date": created_at
                }
            }
            commits.append(commit)
        
        # Generate files
        file_count = random.randint(1, 5)
        pr_files = []
        for j in range(file_count):
            file_path = random.choice(files)
            file_data = {
                "filename": file_path,
                "status": random.choice(["modified", "added", "removed"]),
                "additions": random.randint(1, 100),
                "deletions": random.randint(0, 50),
                "changes": random.randint(1, 150)
            }
            pr_files.append(file_data)
        
        # Create PR info
        pr_info = {
            "number": pr_number,
            "title": title,
            "state": state,
            "created_at": created_at,
            "updated_at": updated_at,
            "closed_at": closed_at,
            "merged_at": merged_at,
            "user": author,
            "html_url": f"https://github.com/GoogleCloudPlatform/microservices-demo/pull/{pr_number}",
            "body": f"This PR {title.lower()}.",
            "commits": commits,
            "files": pr_files,
            "commit_count": commit_count,
            "file_count": file_count
        }
        
        # Add to lists
        pull_requests.append({
            "number": pr_number,
            "title": title,
            "state": state,
            "user": author,
            "created_at": created_at,
            "updated_at": updated_at,
            "html_url": f"https://github.com/GoogleCloudPlatform/microservices-demo/pull/{pr_number}"
        })
        pr_details.append(pr_info)
    
    return {
        "count": count,
        "details": pr_details
    }

def generate_mock_commits(count=500):
    """Generate mock commits data"""
    print(f"Generating {count} mock commits...")
    
    commits = []
    
    # Common commit messages
    messages = [
        "Update dependencies",
        "Fix bug in checkout service",
        "Add new feature to frontend",
        "Improve performance in cart service",
        "Update documentation",
        "Fix security vulnerability",
        "Add unit tests",
        "Refactor code",
        "Update Docker image",
        "Fix typo in README"
    ]
    
    # Common authors
    authors = [
        {"login": "renovate-bot"},
        {"login": "dependabot"},
        {"login": "googlebot"},
        {"login": "developer1"},
        {"login": "developer2"},
        {"login": "developer3"}
    ]
    
    # Generate commits
    for i in range(count):
        author = random.choice(authors)
        message = random.choice(messages)
        
        commit = {
            "sha": f"abc123def456{i}",
            "commit": {
                "message": message,
                "author": {
                    "name": author["login"],
                    "email": f"{author['login']}@example.com",
                    "date": (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat()
                },
                "committer": {
                    "name": author["login"],
                    "email": f"{author['login']}@example.com",
                    "date": (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat()
                }
            },
            "author": author,
            "committer": author,
            "html_url": f"https://github.com/GoogleCloudPlatform/microservices-demo/commit/abc123def456{i}"
        }
        
        commits.append(commit)
    
    return {
        "count": count,
        "list": commits
    }

def analyze_repository_activity(pull_requests, commits):
    """Analyze repository activity to generate statistics"""
    print("Analyzing repository activity...")
    
    # Initialize statistics
    stats = {
        "pull_requests": {
            "total": len(pull_requests["details"]),
            "open": sum(1 for pr in pull_requests["details"] if pr["state"] == "open"),
            "closed": sum(1 for pr in pull_requests["details"] if pr["state"] == "closed"),
            "merged": sum(1 for pr in pull_requests["details"] if pr["merged_at"] is not None),
            "by_author": {},
            "by_file": {},
            "by_month": {}
        },
        "commits": {
            "total": len(commits["list"]),
            "by_author": {},
            "by_month": {}
        }
    }
    
    # Analyze pull requests
    for pr in pull_requests["details"]:
        # Count by author
        author = pr["user"]["login"]
        stats["pull_requests"]["by_author"][author] = stats["pull_requests"]["by_author"].get(author, 0) + 1
        
        # Count by month
        if pr["created_at"]:
            month = pr["created_at"][:7]  # Format: YYYY-MM
            stats["pull_requests"]["by_month"][month] = stats["pull_requests"]["by_month"].get(month, 0) + 1
        
        # Count by file
        for file in pr["files"]:
            filename = file["filename"]
            stats["pull_requests"]["by_file"][filename] = stats["pull_requests"]["by_file"].get(filename, 0) + 1
    
    # Analyze commits
    for commit in commits["list"]:
        # Count by author
        if "author" in commit and commit["author"]:
            author = commit["author"]["login"] if commit["author"] else "Unknown"
        else:
            author = "Unknown"
        stats["commits"]["by_author"][author] = stats["commits"]["by_author"].get(author, 0) + 1
        
        # Count by month
        if "commit" in commit and "author" in commit["commit"] and "date" in commit["commit"]["author"]:
            month = commit["commit"]["author"]["date"][:7]  # Format: YYYY-MM
            stats["commits"]["by_month"][month] = stats["commits"]["by_month"].get(month, 0) + 1
    
    print("Repository activity analysis complete")
    return stats

def main():
    """Main function to generate mock repository activity data"""
    print("Generating mock repository activity data...")
    
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Generate mock pull requests
    pull_requests = generate_mock_pull_requests(count=100)
    
    # Generate mock commits
    commits = generate_mock_commits(count=500)
    
    # Analyze repository activity
    stats = analyze_repository_activity(pull_requests, commits)
    
    # Create result object
    result = {
        "repository": {
            "owner": "GoogleCloudPlatform",
            "name": "microservices-demo",
            "full_name": "GoogleCloudPlatform/microservices-demo"
        },
        "pull_requests": pull_requests,
        "commits": commits,
        "statistics": stats,
        "timestamp": datetime.now().isoformat()
    }
    
    # Save results
    pr_json_path = os.path.join(OUTPUT_DIR, "pull_requests.json")
    with open(pr_json_path, 'w') as f:
        json.dump(result["pull_requests"], f, indent=2, default=str)
    
    commits_json_path = os.path.join(OUTPUT_DIR, "commits.json")
    with open(commits_json_path, 'w') as f:
        json.dump(result["commits"], f, indent=2, default=str)
    
    stats_json_path = os.path.join(OUTPUT_DIR, "repo_statistics.json")
    with open(stats_json_path, 'w') as f:
        json.dump(result["statistics"], f, indent=2, default=str)
    
    summary_json_path = os.path.join(OUTPUT_DIR, "repo_activity_summary.json")
    with open(summary_json_path, 'w') as f:
        summary = {
            "repository": result["repository"],
            "pull_request_count": result["pull_requests"]["count"],
            "commit_count": result["commits"]["count"],
            "statistics": result["statistics"],
            "timestamp": result["timestamp"]
        }
        json.dump(summary, f, indent=2, default=str)
    
    print(f"Mock repository activity data generation complete!")
    print(f"Results saved to:")
    print(f"  - Pull Requests: {pr_json_path}")
    print(f"  - Commits: {commits_json_path}")
    print(f"  - Statistics: {stats_json_path}")
    print(f"  - Summary: {summary_json_path}")

if __name__ == "__main__":
    main()
