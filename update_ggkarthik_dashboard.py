#!/usr/bin/env python3
"""
Update GGKarthik Dashboard Data Generator

This script analyzes the ggkarthik/microservices-demo-app repository and generates
updated data for the React dashboard, focusing on:
1. Technologies data
2. Infrastructure resources
3. Repository activity data
4. Docker image layer information
"""

import os
import json
import re
import subprocess
import requests
from datetime import datetime
from collections import defaultdict
import logging
import glob

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Paths
REPO_PATH = "/Users/gowrikarthik.gadela/Desktop/Cascade_Project1/microservices-demo-app"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
REACT_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "react-dashboard/src/data")
PUBLIC_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "react-dashboard/public/data")

# GitHub repository information
REPO_OWNER = "ggkarthik"
REPO_NAME = "microservices-demo-app"
GITHUB_API = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}"

# Ensure output directories exist
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(REACT_DATA_DIR, exist_ok=True)
os.makedirs(PUBLIC_DATA_DIR, exist_ok=True)

def get_github_data(endpoint, params=None):
    """Make a GET request to the GitHub API."""
    url = f"{GITHUB_API}/{endpoint}" if endpoint else GITHUB_API
    headers = {"Accept": "application/vnd.github.v3+json"}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching data from GitHub: {e}")
        return None

def analyze_technologies():
    """Analyze technologies used in the repository."""
    logger.info("Analyzing technologies...")
    
    # Initialize language counters
    language_bytes = {}
    language_files = defaultdict(int)
    
    # File extensions to language mapping
    extension_to_language = {
        '.go': 'Go',
        '.py': 'Python',
        '.js': 'JavaScript',
        '.ts': 'TypeScript',
        '.java': 'Java',
        '.cs': 'C#',
        '.html': 'HTML',
        '.css': 'CSS',
        '.sh': 'Shell',
        '.yaml': 'YAML',
        '.yml': 'YAML',
        '.json': 'JSON',
        '.md': 'Markdown',
        '.proto': 'Protocol Buffers'
    }
    
    # Framework detection patterns
    framework_patterns = {
        'Go': {
            'Gin': r'github\.com/gin-gonic/gin',
            'gRPC': r'google\.golang\.org/grpc',
            'Echo': r'github\.com/labstack/echo',
        },
        'Python': {
            'Flask': r'from flask import|import flask',
            'Django': r'from django|import django',
            'FastAPI': r'from fastapi|import fastapi',
            'gRPC': r'import grpc',
        },
        'JavaScript': {
            'React': r'from \'react\'|import React|from "react"',
            'Express': r'require\(\'express\'\)|import express|require\("express"\)',
            'Next.js': r'from \'next\'|import next|from "next"',
        },
        'TypeScript': {
            'React': r'from \'react\'|import React|from "react"',
            'Express': r'require\(\'express\'\)|import express|require\("express"\)',
            'Next.js': r'from \'next\'|import next|from "next"',
        },
        'Java': {
            'Spring Boot': r'import org\.springframework\.boot',
            'gRPC': r'import io\.grpc',
            'Hibernate': r'import org\.hibernate',
        },
        'C#': {
            'ASP.NET Core': r'using Microsoft\.AspNetCore',
            'Entity Framework': r'using Microsoft\.EntityFrameworkCore',
            'gRPC': r'using Grpc',
        }
    }
    
    # Database detection patterns
    database_patterns = {
        'Redis': r'redis\.|Redis\.|redis:|REDIS_',
        'MongoDB': r'mongo\.|Mongo\.|mongodb:|MONGO_',
        'PostgreSQL': r'postgres\.|Postgres\.|postgresql:|POSTGRES_',
        'MySQL': r'mysql\.|MySQL\.|mysql:|MYSQL_',
        'SQLite': r'sqlite\.|SQLite\.|sqlite:|SQLITE_'
    }
    
    # Cloud platform detection patterns
    cloud_patterns = {
        'Google Cloud': r'google\.cloud|gcloud|GCP_|gcp\.|GKE_',
        'Kubernetes': r'kubernetes|k8s|kubectl|KUBE_',
        'Docker': r'docker|Dockerfile|DOCKER_',
        'AWS': r'aws\.|AWS\.|AWS_',
        'Azure': r'azure\.|Azure\.|AZURE_'
    }
    
    # Tool detection patterns
    tool_patterns = {
        'CI/CD': {
            'GitHub Actions': r'\.github/workflows',
            'Jenkins': r'Jenkinsfile',
            'CircleCI': r'\.circleci',
            'GitLab CI': r'\.gitlab-ci',
        },
        'Monitoring': {
            'Prometheus': r'prometheus\.|Prometheus\.',
            'Grafana': r'grafana\.|Grafana\.',
            'Jaeger': r'jaeger\.|Jaeger\.',
            'OpenTelemetry': r'opentelemetry\.|OpenTelemetry\.',
        },
        'Infrastructure': {
            'Terraform': r'\.tf$|terraform\.|Terraform\.',
            'Helm': r'\.helm|helm\.|Helm\.',
            'Skaffold': r'skaffold\.|Skaffold\.',
            'Kustomize': r'kustomize\.|Kustomize\.|kustomization\.yaml',
        }
    }
    
    # Detected technologies
    frameworks = []
    databases = []
    cloud_platforms = []
    tools = []
    
    # Walk through repository
    for root, _, files in os.walk(REPO_PATH):
        # Skip .git directory
        if '.git' in root:
            continue
        
        for file in files:
            file_path = os.path.join(root, file)
            _, ext = os.path.splitext(file)
            
            # Count file by language
            if ext in extension_to_language:
                language = extension_to_language[ext]
                language_files[language] += 1
                
                # Get file size
                try:
                    file_size = os.path.getsize(file_path)
                    language_bytes[language] = language_bytes.get(language, 0) + file_size
                except OSError:
                    pass
                
                # Check for frameworks
                if language in framework_patterns:
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            for framework, pattern in framework_patterns[language].items():
                                if re.search(pattern, content):
                                    if not any(f['name'] == framework for f in frameworks):
                                        frameworks.append({
                                            'name': framework,
                                            'language': language,
                                            'confidence': 0.9,
                                            'usage': 5
                                        })
                    except:
                        pass
                
                # Check for databases
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        for db, pattern in database_patterns.items():
                            if re.search(pattern, content):
                                if not any(d['name'] == db for d in databases):
                                    databases.append({
                                        'name': db,
                                        'category': 'database',
                                        'confidence': 0.8,
                                        'usage': 5
                                    })
                except:
                    pass
                
                # Check for cloud platforms
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        for platform, pattern in cloud_patterns.items():
                            if re.search(pattern, content):
                                if not any(p['name'] == platform for p in cloud_platforms):
                                    cloud_platforms.append({
                                        'name': platform,
                                        'category': 'cloud',
                                        'confidence': 0.8,
                                        'usage': 5
                                    })
                except:
                    pass
            
            # Check for tools
            for category, category_tools in tool_patterns.items():
                for tool, pattern in category_tools.items():
                    if re.search(pattern, file_path):
                        if not any(t['name'] == tool for t in tools):
                            tools.append({
                                'name': tool,
                                'category': category,
                                'confidence': 0.9,
                                'usage': 5
                            })
    
    # Calculate language distribution
    total_bytes = sum(language_bytes.values())
    language_distribution = {lang: round((bytes_count / total_bytes) * 100, 2) 
                            for lang, bytes_count in language_bytes.items()}
    
    # Find primary language
    primary_language = max(language_distribution.items(), key=lambda x: x[1])[0] if language_distribution else "Unknown"
    
    return {
        "languages": language_bytes,
        "language_distribution": language_distribution,
        "primary_language": primary_language,
        "frameworks": frameworks,
        "databases": databases,
        "cloud_platforms": cloud_platforms,
        "tools": tools,
        "timestamp": datetime.now().isoformat()
    }

def analyze_infrastructure_resources():
    """Analyze infrastructure resources in the repository."""
    logger.info("Analyzing infrastructure resources...")
    
    # Initialize infrastructure data
    pipelines = []
    artifacts = []
    infrastructure_resources = []
    
    # Check for GitHub Actions workflows
    workflow_dir = os.path.join(REPO_PATH, '.github', 'workflows')
    if os.path.exists(workflow_dir):
        for workflow_file in os.listdir(workflow_dir):
            if workflow_file.endswith('.yml') or workflow_file.endswith('.yaml'):
                pipelines.append({
                    "name": workflow_file.replace('.yml', '').replace('.yaml', ''),
                    "type": "github-actions",
                    "path": f".github/workflows/{workflow_file}",
                    "status": "active"
                })
    
    # Check for Kubernetes manifests
    k8s_dir = os.path.join(REPO_PATH, 'kubernetes-manifests')
    if os.path.exists(k8s_dir):
        k8s_resources = []
        for file in os.listdir(k8s_dir):
            if file.endswith('.yaml') or file.endswith('.yml'):
                try:
                    with open(os.path.join(k8s_dir, file), 'r') as f:
                        content = f.read()
                        # Extract resource types from Kubernetes manifests
                        resource_types = re.findall(r'kind:\s*(\w+)', content)
                        for resource_type in resource_types:
                            if resource_type not in k8s_resources:
                                k8s_resources.append(resource_type)
                except:
                    pass
        
        if k8s_resources:
            infrastructure_resources.append({
                "type": "kubernetes",
                "resources": k8s_resources,
                "providers": ["GKE"],
                "environments": ["dev", "prod"]
            })
    
    # Check for Docker images
    docker_files = []
    for root, _, files in os.walk(REPO_PATH):
        for file in files:
            if file == 'Dockerfile':
                docker_files.append(os.path.join(root, file))
    
    for docker_file in docker_files:
        service_name = os.path.basename(os.path.dirname(docker_file))
        artifacts.append({
            "name": service_name,
            "type": "docker",
            "path": f"gcr.io/microservices-demo/{service_name}"
        })
    
    # Check for Terraform files
    terraform_files = glob.glob(os.path.join(REPO_PATH, '**/*.tf'), recursive=True)
    if terraform_files:
        infrastructure_resources.append({
            "type": "terraform",
            "resources": ["VPC", "Subnet", "Cluster"],
            "providers": ["Google Cloud"],
            "environments": ["dev", "prod"]
        })
    
    # Check for Helm charts
    helm_charts = glob.glob(os.path.join(REPO_PATH, '**/Chart.yaml'), recursive=True)
    if helm_charts:
        infrastructure_resources.append({
            "type": "helm",
            "resources": ["Charts"],
            "providers": ["Kubernetes"],
            "environments": ["dev", "prod"]
        })
    
    # Check for Redis
    redis_files = glob.glob(os.path.join(REPO_PATH, '**/*.yaml'), recursive=True)
    redis_found = False
    for file in redis_files:
        try:
            with open(file, 'r') as f:
                content = f.read()
                if 'redis' in content.lower():
                    redis_found = True
                    break
        except:
            pass
    
    if redis_found:
        infrastructure_resources.append({
            "type": "redis",
            "resources": ["Cache"],
            "providers": ["Redis"],
            "environments": ["dev", "prod"]
        })
    
    return {
        "pipelines": pipelines,
        "artifacts": artifacts,
        "infrastructure": infrastructure_resources
    }

def fetch_repository_activity():
    """Fetch repository activity data from GitHub."""
    logger.info("Fetching repository activity data...")
    
    # Get repository information
    repo_data = get_github_data("")
    if not repo_data:
        logger.error("Failed to fetch repository data")
        return None
    
    # Get pull requests
    pull_requests = get_github_data("pulls", {"state": "all", "per_page": 30})
    if not pull_requests:
        pull_requests = []
    
    # Get commits
    commits = get_github_data("commits", {"per_page": 50})
    if not commits:
        commits = []
    
    # Process pull requests
    pr_details = []
    for pr in pull_requests[:10]:  # Process top 10 PRs
        pr_number = pr["number"]
        
        # Get PR details
        details = get_github_data(f"pulls/{pr_number}")
        if not details:
            continue
        
        # Get PR commits
        pr_commits = get_github_data(f"pulls/{pr_number}/commits")
        if not pr_commits:
            pr_commits = []
        
        # Get PR files
        pr_files = get_github_data(f"pulls/{pr_number}/files")
        if not pr_files:
            pr_files = []
        
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
                for commit in pr_commits
            ],
            "files": [
                {
                    "filename": file["filename"],
                    "status": file["status"],
                    "additions": file["additions"],
                    "deletions": file["deletions"],
                    "changes": file["changes"]
                }
                for file in pr_files
            ],
            "commit_count": len(pr_commits),
            "file_count": len(pr_files)
        }
        
        pr_details.append(pr_info)
    
    # Analyze repository activity
    stats = {
        "pull_requests": {
            "total": len(pull_requests),
            "open": sum(1 for pr in pull_requests if pr["state"] == "open"),
            "closed": sum(1 for pr in pull_requests if pr["state"] == "closed"),
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
        stats["pull_requests"]["by_author"][author] = stats["pull_requests"]["by_author"].get(author, 0) + 1
        
        # Count by month
        if pr["created_at"]:
            month = pr["created_at"][:7]  # Format: YYYY-MM
            stats["pull_requests"]["by_month"][month] = stats["pull_requests"]["by_month"].get(month, 0) + 1
        
        # Count by file
        for file in pr["files"]:
            stats["pull_requests"]["by_file"][file["filename"]] = stats["pull_requests"]["by_file"].get(file["filename"], 0) + 1
    
    # Analyze commits
    for commit in commits:
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
    
    return result

def analyze_docker_images():
    """Analyze Docker images and extract layer information."""
    logger.info("Analyzing Docker images...")
    
    images = []
    base_image_insights = {}
    
    # Find all Dockerfiles
    docker_files = []
    for root, _, files in os.walk(REPO_PATH):
        for file in files:
            if file == 'Dockerfile':
                docker_files.append(os.path.join(root, file))
    
    for docker_file in docker_files:
        service_name = os.path.basename(os.path.dirname(docker_file))
        
        try:
            with open(docker_file, 'r') as f:
                content = f.read()
                
                # Extract base image
                base_image_match = re.search(r'FROM\s+([^\n]+)', content)
                if base_image_match:
                    base_image_full = base_image_match.group(1).strip()
                    
                    # Handle multi-stage builds
                    if ' as ' in base_image_full.lower():
                        base_image_full = base_image_full.split(' as ')[0].strip()
                    elif ' AS ' in base_image_full:
                        base_image_full = base_image_full.split(' AS ')[0].strip()
                    
                    # Remove build arguments if present
                    if '--platform=' in base_image_full:
                        parts = base_image_full.split(' ')
                        filtered_parts = [p for p in parts if not p.startswith('--')]
                        base_image_full = ' '.join(filtered_parts)
                    
                    # Remove SHA256 digest if present
                    if '@sha256:' in base_image_full:
                        base_image_full = base_image_full.split('@sha256:')[0]
                    
                    # Ensure we have a tag
                    if ':' not in base_image_full:
                        base_image = f"{base_image_full}:latest"
                    else:
                        base_image = base_image_full
                    
                    # Extract layers (each RUN, COPY, ADD instruction creates a layer)
                    layers = []
                    layer_commands = re.findall(r'(RUN|COPY|ADD)\s+(.+?)(?=\n[A-Z]|\Z)', content, re.DOTALL)
                    
                    for cmd_type, cmd in layer_commands:
                        # Ensure command is always a string
                        cmd_str = cmd.strip()
                        layers.append({
                            "type": cmd_type,
                            "command": cmd_str,
                            "size_estimate": "varies"  # Actual size would require building the image
                        })
                    
                    # Extract packages installed (approximate from RUN commands)
                    packages = []
                    apt_packages = re.findall(r'apt-get\s+install\s+(.+?)(?=\n|\Z|&&)', content)
                    for pkg_list in apt_packages:
                        packages.extend([p.strip() for p in pkg_list.split() if not p.startswith('-')])
                    
                    pip_packages = re.findall(r'pip\s+install\s+(.+?)(?=\n|\Z|&&)', content)
                    for pkg_list in pip_packages:
                        packages.extend([p.strip() for p in pkg_list.split() if not p.startswith('-')])
                    
                    npm_packages = re.findall(r'npm\s+install\s+(.+?)(?=\n|\Z|&&)', content)
                    for pkg_list in npm_packages:
                        packages.extend([p.strip() for p in pkg_list.split() if not p.startswith('-')])
                    
                    # Remove duplicates and package options
                    packages = list(set([p for p in packages if not p.startswith('-')]))
                    
                    # Add image information
                    images.append({
                        "name": service_name,
                        "baseImage": base_image,
                        "layers": layers,
                        "packages": packages,
                        "size_estimate": f"{len(layers) * 10 + 20}MB"  # Very rough estimate
                    })
                    
                    # Add base image insights if not already present
                    if base_image not in base_image_insights:
                        base_image_insights[base_image] = {
                            "vulnerabilities": []  # Would require actual scanning
                        }
        except Exception as e:
            logger.error(f"Error processing Dockerfile {docker_file}: {e}")
    
    return {
        "images": images,
        "baseImageInsights": base_image_insights
    }

def main():
    """Main function to update the dashboard data."""
    logger.info("Starting dashboard data update...")
    
    # Analyze technologies
    technologies_data = analyze_technologies()
    
    # Analyze infrastructure resources
    infrastructure_data = analyze_infrastructure_resources()
    
    # Fetch repository activity
    repo_activity = fetch_repository_activity()
    
    # Analyze Docker images
    docker_images_data = analyze_docker_images()
    
    # Save technologies data
    technologies_output_paths = [
        os.path.join(OUTPUT_DIR, "technologies_data.json"),
        os.path.join(REACT_DATA_DIR, "technologies_data.json"),
        os.path.join(PUBLIC_DATA_DIR, "technologies_data.json")
    ]
    for path in technologies_output_paths:
        with open(path, 'w') as f:
            json.dump(technologies_data, f, indent=2)
        logger.info(f"Technologies data saved to: {path}")
    
    # Save infrastructure data
    # Update the existing microservices_inventory.json with new infrastructure data
    inventory_paths = [
        os.path.join(OUTPUT_DIR, "microservices_inventory.json"),
        os.path.join(REACT_DATA_DIR, "microservices_inventory.json"),
        os.path.join(PUBLIC_DATA_DIR, "microservices_inventory.json")
    ]
    for path in inventory_paths:
        try:
            with open(path, 'r') as f:
                inventory_data = json.load(f)
            
            # Update infrastructure section
            inventory_data["infrastructure"] = infrastructure_data
            
            with open(path, 'w') as f:
                json.dump(inventory_data, f, indent=2)
            
            logger.info(f"Infrastructure data updated in: {path}")
        except Exception as e:
            logger.error(f"Error updating infrastructure data in {path}: {e}")
    
    # Save repository activity data
    if repo_activity:
        repo_activity_paths = [
            os.path.join(OUTPUT_DIR, "repo_activity_summary.json"),
            os.path.join(REACT_DATA_DIR, "repo_activity_summary.json"),
            os.path.join(PUBLIC_DATA_DIR, "repo_activity_summary.json")
        ]
        for path in repo_activity_paths:
            with open(path, 'w') as f:
                json.dump(repo_activity, f, indent=2)
            logger.info(f"Repository activity data saved to: {path}")
    
    # Save Docker images data
    base_images_paths = [
        os.path.join(OUTPUT_DIR, "base_images_data.json"),
        os.path.join(REACT_DATA_DIR, "base_images_data.json"),
        os.path.join(PUBLIC_DATA_DIR, "base_images_data.json")
    ]
    for path in base_images_paths:
        with open(path, 'w') as f:
            json.dump(docker_images_data, f, indent=2)
        logger.info(f"Docker images data saved to: {path}")
    
    logger.info("Dashboard data update complete!")

if __name__ == "__main__":
    main()
