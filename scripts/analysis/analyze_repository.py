#!/usr/bin/env python3
"""
Unified Repository Analyzer

This script analyzes any GitHub repository (especially microservices-demo variants),
extracts inventory information, and generates data for the React dashboard.

Consolidates functionality from:
- analyze_microservices_demo.py
- analyze_microservices_demo_mcp.py
- analyze_google_repo.py
- analyze_ggkarthik_repo.py
"""

import os
import sys
import json
import requests
import logging
import argparse
from datetime import datetime
from pathlib import Path
import time

# Import centralized configuration
try:
    from config import (
        get_all_output_paths,
        GITHUB_API_BASE,
        GITHUB_REPO_OWNER,
        GITHUB_REPO_NAME,
        MICROSERVICES,
        LOG_LEVEL,
        LOG_FORMAT,
    )
except ImportError:
    print("Error: Could not import config.py. Make sure it exists in the project root.")
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format=LOG_FORMAT,
)
logger = logging.getLogger(__name__)


class RepositoryAnalyzer:
    """
    Unified analyzer for microservices repositories.
    """
    
    def __init__(self, owner=None, repo=None, use_mcp=False):
        """
        Initialize the analyzer.
        
        Args:
            owner: Repository owner (defaults to config)
            repo: Repository name (defaults to config)
            use_mcp: Whether to use GitHub MCP (not yet implemented)
        """
        self.owner = owner or GITHUB_REPO_OWNER
        self.repo = repo or GITHUB_REPO_NAME
        self.use_mcp = use_mcp
        self.github_api = f"{GITHUB_API_BASE}/repos/{self.owner}/{self.repo}"
        
        # Known microservices with their languages
        self.known_services = {ms['name']: ms['language'] for ms in MICROSERVICES}
        
        logger.info(f"Initialized analyzer for {self.owner}/{self.repo}")
    
    def get_github_data(self, endpoint="", params=None):
        """
        Make a GET request to the GitHub API.
        
        Args:
            endpoint: API endpoint (relative to repo)
            params: Query parameters
            
        Returns:
            JSON response or None on error
        """
        url = f"{self.github_api}/{endpoint}" if endpoint else self.github_api
        headers = {"Accept": "application/vnd.github.v3+json"}
        
        # Add GitHub token if available
        github_token = os.environ.get('GITHUB_TOKEN')
        if github_token:
            headers["Authorization"] = f"token {github_token}"
        
        try:
            response = requests.get(url, headers=headers, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching data from {url}: {e}")
            return None
    
    def detect_language(self, service_name):
        """
        Detect the primary programming language used in a service.
        
        Args:
            service_name: Name of the service
            
        Returns:
            Language name or "Unknown"
        """
        # Check known services first
        if service_name in self.known_services:
            return self.known_services[service_name]
        
        # Try to detect from service directory
        try:
            contents = self.get_github_data(f"contents/src/{service_name}")
            if not contents:
                return "Unknown"
            
            # Check for language-specific files
            for item in contents:
                name = item.get("name", "").lower()
                if name.endswith(".go"):
                    return "Go"
                elif name.endswith(".py"):
                    return "Python"
                elif name.endswith(".js") or name.endswith(".ts"):
                    return "Node.js"
                elif name.endswith(".java"):
                    return "Java"
                elif name.endswith(".cs"):
                    return "C#"
                elif name == "dockerfile":
                    # Try to detect from Dockerfile
                    pass
            
            return "Unknown"
        except Exception as e:
            logger.warning(f"Could not detect language for {service_name}: {e}")
            return "Unknown"
    
    def get_service_description(self, service_name):
        """
        Get a description for the given service.
        
        Args:
            service_name: Name of the service
            
        Returns:
            Description string
        """
        # Check known services first
        for ms in MICROSERVICES:
            if ms['name'] == service_name:
                return ms['description']
        
        # Try to get from README
        try:
            readme = self.get_github_data(f"contents/src/{service_name}/README.md")
            if readme and readme.get("content"):
                import base64
                content = base64.b64decode(readme["content"]).decode("utf-8")
                # Extract first paragraph
                lines = content.split("\n")
                for line in lines:
                    line = line.strip()
                    if line and not line.startswith("#"):
                        return line
        except Exception as e:
            logger.debug(f"Could not get description for {service_name}: {e}")
        
        return f"Microservice: {service_name}"
    
    def get_service_dependencies(self, service_name, language):
        """
        Get dependencies for a specific service.
        
        Args:
            service_name: Name of the service
            language: Programming language
            
        Returns:
            List of dependencies
        """
        dependencies = []
        
        try:
            # Check for dependency files based on language
            dep_files = {
                "Go": ["go.mod", "go.sum"],
                "Python": ["requirements.txt", "Pipfile", "pyproject.toml"],
                "Node.js": ["package.json"],
                "Java": ["pom.xml", "build.gradle"],
                "C#": ["*.csproj", "packages.config"]
            }
            
            files_to_check = dep_files.get(language, [])
            contents = self.get_github_data(f"contents/src/{service_name}")
            
            if contents:
                for item in contents:
                    name = item.get("name", "")
                    if name in files_to_check or any(name.endswith(f) for f in files_to_check if "*" in f):
                        dependencies.append({
                            "name": name,
                            "type": "dependency_file",
                            "path": f"src/{service_name}/{name}"
                        })
        except Exception as e:
            logger.debug(f"Could not get dependencies for {service_name}: {e}")
        
        return dependencies
    
    def get_service_apis(self, service_name):
        """
        Get APIs for a specific service.
        
        Args:
            service_name: Name of the service
            
        Returns:
            List of API endpoints
        """
        # For microservices-demo, most services use gRPC
        return [{
            "path": f"/{service_name}",
            "method": "gRPC",
            "description": f"gRPC service for {service_name}"
        }]
    
    def get_repository_activity(self):
        """
        Get repository activity data including pull requests, commits, etc.
        
        Returns:
            Activity data dictionary
        """
        logger.info("Fetching repository activity...")
        
        try:
            # Get pull requests
            prs = self.get_github_data("pulls", params={"state": "all", "per_page": 5})
            
            # Get commits
            commits = self.get_github_data("commits", params={"per_page": 10})
            
            # Get contributors
            contributors = self.get_github_data("contributors", params={"per_page": 10})
            
            # Process pull requests
            pull_requests = []
            if prs:
                for pr in prs:
                    pull_requests.append({
                        "number": pr.get("number"),
                        "title": pr.get("title"),
                        "state": pr.get("state"),
                        "created_at": pr.get("created_at"),
                        "updated_at": pr.get("updated_at"),
                        "user": pr.get("user", {}).get("login"),
                        "url": pr.get("html_url")
                    })
            
            # Process commits
            commit_list = []
            if commits:
                for commit in commits:
                    commit_list.append({
                        "sha": commit.get("sha"),
                        "message": commit.get("commit", {}).get("message"),
                        "author": commit.get("commit", {}).get("author", {}).get("name"),
                        "date": commit.get("commit", {}).get("author", {}).get("date"),
                        "url": commit.get("html_url")
                    })
            
            return {
                "summary": {
                    "total_pull_requests": len(pull_requests),
                    "total_commits": len(commit_list),
                    "total_contributors": len(contributors) if contributors else 0
                },
                "pull_requests": pull_requests,
                "commits": commit_list,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error fetching repository activity: {e}")
            return {
                "summary": {
                    "total_pull_requests": 0,
                    "total_commits": 0,
                    "total_contributors": 0
                },
                "pull_requests": [],
                "commits": [],
                "timestamp": datetime.now().isoformat()
            }
    
    def analyze_repository(self):
        """
        Analyze the repository and extract inventory information.
        
        Returns:
            Dictionary containing inventory, activity, and image data
        """
        logger.info(f"Analyzing repository: {self.owner}/{self.repo}")
        
        try:
            # Get repository information
            repo_data = self.get_github_data("")
            if not repo_data:
                logger.warning("Failed to fetch repository data, using defaults")
                repo_data = {
                    "full_name": f"{self.owner}/{self.repo}",
                    "description": "Microservices demo application",
                    "html_url": f"https://github.com/{self.owner}/{self.repo}"
                }
            
            # Get repository contents (list of directories in src/)
            contents = self.get_github_data("contents/src")
            if not contents:
                logger.warning("Failed to fetch repository contents, using known services")
                # Use known microservices
                microservices = [ms['name'] for ms in MICROSERVICES]
            else:
                # Extract microservices (directories in src/)
                microservices = [item.get("name") for item in contents if item.get("type") == "dir"]
            
            logger.info(f"Found {len(microservices)} microservices: {', '.join(microservices)}")
            
            # Collect data for each microservice
            services_data = []
            languages_used = {}
            dependencies_data = {"total_count": 0, "dependencies": []}
            apis_data = {"endpoints": []}
            
            for service in microservices:
                logger.info(f"Analyzing service: {service}")
                
                language = self.detect_language(service)
                description = self.get_service_description(service)
                dependencies = self.get_service_dependencies(service, language)
                apis = self.get_service_apis(service)
                
                service_info = {
                    "name": service,
                    "language": language,
                    "description": description,
                    "path": f"src/{service}",
                    "dependencies": dependencies,
                    "apis": apis
                }
                
                services_data.append(service_info)
                
                # Update language counts
                if language:
                    languages_used[lang] = languages_used.get(language, 0) + 1
                
                # Add dependencies
                if dependencies:
                    dependencies_data["dependencies"].extend(dependencies)
                    dependencies_data["total_count"] += len(dependencies)
                
                # Add APIs
                if apis:
                    apis_data["endpoints"].extend(apis)
            
            # Get repository activity data
            activity_data = self.get_repository_activity()
            
            # Create microservices inventory data
            inventory_data = {
                "repository": {
                    "full_name": f"{self.owner}/{self.repo}",
                    "description": repo_data.get("description", ""),
                    "url": repo_data.get("html_url", "")
                },
                "services": {
                    "services": services_data,
                    "total_count": len(services_data)
                },
                "technologies": {
                    "languages": languages_used,
                    "frameworks": {},
                    "databases": [],
                    "tools": []
                },
                "dependencies": dependencies_data,
                "apis": apis_data,
                "infrastructure": {
                    "pipelines": [
                        {"name": "CI Pipeline", "type": "github-actions", "status": "active"}
                    ],
                    "artifacts": [
                        {"name": "Docker Images", "type": "docker", "count": len(services_data)}
                    ]
                },
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            # Create image inventory data (simplified)
            image_data = {
                "images": [
                    {
                        "name": f"{service['name']}",
                        "tag": "latest",
                        "registry": "gcr.io",
                        "repository": f"{self.owner}/{self.repo}",
                        "size": "100MB",
                        "created": datetime.now().isoformat()
                    }
                    for service in services_data
                ],
                "infrastructure": {
                    "clusters": 1,
                    "nodes": 3,
                    "namespaces": 1
                },
                "timestamp": datetime.now().isoformat()
            }
            
            return {
                "inventory": inventory_data,
                "activity": activity_data,
                "image": image_data
            }
            
        except Exception as e:
            logger.error(f"Error analyzing repository: {e}", exc_info=True)
            return None
    
    def save_data(self, data):
        """
        Save analysis data to output files.
        
        Args:
            data: Dictionary containing inventory, activity, and image data
        """
        if not data:
            logger.error("No data to save")
            return
        
        try:
            # Save inventory data
            inventory_paths = get_all_output_paths('inventory')
            for path in inventory_paths:
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, 'w') as f:
                    json.dump(data["inventory"], f, indent=2)
                logger.info(f"Inventory data saved to: {path}")
            
            # Save activity data
            activity_paths = get_all_output_paths('activity')
            for path in activity_paths:
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, 'w') as f:
                    json.dump(data["activity"], f, indent=2)
                logger.info(f"Activity data saved to: {path}")
            
            # Save image data
            image_paths = get_all_output_paths('image_inventory')
            for path in image_paths:
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, 'w') as f:
                    json.dump(data["image"], f, indent=2)
                logger.info(f"Image data saved to: {path}")
                
        except Exception as e:
            logger.error(f"Error saving data: {e}", exc_info=True)


def main():
    """
    Main function to run the repository analysis.
    """
    parser = argparse.ArgumentParser(description="Analyze a GitHub repository")
    parser.add_argument("--owner", help="Repository owner (defaults to config)")
    parser.add_argument("--repo", help="Repository name (defaults to config)")
    parser.add_argument("--use-mcp", action="store_true", help="Use GitHub MCP (not yet implemented)")
    
    args = parser.parse_args()
    
    try:
        logger.info("Starting repository analysis...")
        
        # Create analyzer
        analyzer = RepositoryAnalyzer(owner=args.owner, repo=args.repo, use_mcp=args.use_mcp)
        
        # Analyze repository
        data = analyzer.analyze_repository()
        
        if data:
            # Save data
            analyzer.save_data(data)
            logger.info("Analysis complete. All data has been saved.")
            return 0
        else:
            logger.error("Analysis failed or no data generated.")
            return 1
            
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        return 1


if __name__ == "__main__":
    sys.exit(main())
