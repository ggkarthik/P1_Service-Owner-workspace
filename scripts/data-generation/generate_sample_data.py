#!/usr/bin/env python3
"""
Generate Sample Data

This script generates sample data for the microservices inventory and repository activity
to ensure the React dashboard works properly even without running the analysis scripts.
"""

import os
import json
from datetime import datetime, timedelta
import random

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "react-dashboard/src/data")

# Define microservices with known languages
MICROSERVICES = [
    {
        "name": "frontend",
        "language": "Go",
        "description": "Exposes an HTTP server to serve the website. Does not require signup/login and generates session IDs for all users automatically."
    },
    {
        "name": "cartservice",
        "language": "C#",
        "description": "Stores the items in the user's shopping cart in Redis and retrieves it."
    },
    {
        "name": "productcatalogservice",
        "language": "Go",
        "description": "Provides the list of products from a JSON file and ability to search products and get individual products."
    },
    {
        "name": "currencyservice",
        "language": "Node.js",
        "description": "Converts one money amount to another currency. Uses real values fetched from European Central Bank. It's the highest QPS service."
    },
    {
        "name": "paymentservice",
        "language": "Node.js",
        "description": "Charges the given credit card info (mock) with the given amount and returns a transaction ID."
    },
    {
        "name": "shippingservice",
        "language": "Go",
        "description": "Gives shipping cost estimates based on the shopping cart. Ships items to the given address (mock)."
    },
    {
        "name": "emailservice",
        "language": "Python",
        "description": "Sends users an order confirmation email (mock)."
    },
    {
        "name": "checkoutservice",
        "language": "Go",
        "description": "Retrieves user cart, prepares order and orchestrates the payment, shipping and the email notification."
    },
    {
        "name": "recommendationservice",
        "language": "Python",
        "description": "Recommends other products based on what's given in the cart."
    },
    {
        "name": "adservice",
        "language": "Java",
        "description": "Provides text ads based on given context words."
    },
    {
        "name": "loadgenerator",
        "language": "Python/Locust",
        "description": "Continuously sends requests imitating realistic user shopping flows to the frontend."
    },
    {
        "name": "shoppingassistantservice",
        "language": "Python",
        "description": "AI assistant that suggests products to purchase based on an image using Gemini."
    }
]

def generate_microservices_inventory():
    """Generate sample microservices inventory data"""
    print("Generating sample microservices inventory data...")
    
    # Count languages
    language_counts = {}
    for service in MICROSERVICES:
        lang = service["language"]
        if "/" in lang:  # Handle cases like "Python/Locust"
            lang = lang.split("/")[0]
        language_counts[lang] = language_counts.get(lang, 0) + 1
    
    # Calculate language percentages
    total_services = len(MICROSERVICES)
    language_distribution = {lang: (count / total_services) * 100 for lang, count in language_counts.items()}
    
    # Create language bytes mock data (for visualization)
    language_bytes = {}
    for lang in language_counts:
        language_bytes[lang] = language_counts[lang] * 100000  # Mock byte count based on service count
    
    # Create mock technologies
    technologies = []
    frameworks = []
    
    # Add frameworks based on languages
    if "Go" in language_counts:
        frameworks.extend([
            {"name": "gRPC", "category": "framework", "confidence": 1.0},
            {"name": "Gin", "category": "framework", "confidence": 0.85},
            {"name": "Gorilla/Mux", "category": "framework", "confidence": 0.75}
        ])
    if "Python" in language_counts:
        frameworks.extend([
            {"name": "Flask", "category": "framework", "confidence": 0.9},
            {"name": "Protobuf", "category": "serialization", "confidence": 0.95},
            {"name": "OpenTelemetry", "category": "observability", "confidence": 0.8}
        ])
    if "Node.js" in language_counts:
        frameworks.extend([
            {"name": "Express", "category": "framework", "confidence": 0.9},
            {"name": "gRPC-js", "category": "communication", "confidence": 0.95},
            {"name": "Pino", "category": "logging", "confidence": 0.7}
        ])
    if "Java" in language_counts:
        frameworks.extend([
            {"name": "Spring Boot", "category": "framework", "confidence": 0.9},
            {"name": "gRPC-Java", "category": "communication", "confidence": 0.95},
            {"name": "Hibernate", "category": "ORM", "confidence": 0.6}
        ])
    if "C#" in language_counts:
        frameworks.extend([
            {"name": ".NET Core", "category": "framework", "confidence": 1.0},
            {"name": "gRPC-dotnet", "category": "communication", "confidence": 0.95},
            {"name": "Entity Framework", "category": "ORM", "confidence": 0.7}
        ])
    
    # Add common technologies
    technologies.extend([
        {"name": "Docker", "category": "container", "confidence": 1.0},
        {"name": "Kubernetes", "category": "orchestration", "confidence": 1.0},
        {"name": "gRPC", "category": "communication", "confidence": 1.0},
        {"name": "Redis", "category": "database", "confidence": 0.9},
        {"name": "Istio", "category": "service-mesh", "confidence": 0.8},
        {"name": "Skaffold", "category": "development", "confidence": 0.9},
        {"name": "Kustomize", "category": "deployment", "confidence": 0.9},
        {"name": "Prometheus", "category": "monitoring", "confidence": 0.85},
        {"name": "Grafana", "category": "visualization", "confidence": 0.8},
        {"name": "Jaeger", "category": "tracing", "confidence": 0.75},
        {"name": "Helm", "category": "package-manager", "confidence": 0.7},
        {"name": "GitHub Actions", "category": "ci-cd", "confidence": 0.95},
        {"name": "Terraform", "category": "infrastructure", "confidence": 0.6}
    ])
    
    # Create mock dependencies with more details
    dependencies = []
    
    # Go dependencies
    if "Go" in language_counts:
        dependencies.extend([
            {"name": "grpc", "version": "v1.38.0", "type": "direct", "source": "go", "is_vulnerable": False, "is_outdated": True},
            {"name": "protobuf", "version": "v1.28.0", "type": "direct", "source": "go", "is_vulnerable": False, "is_outdated": False},
            {"name": "gin-gonic/gin", "version": "v1.7.4", "type": "direct", "source": "go", "is_vulnerable": True, "is_outdated": True},
            {"name": "gorilla/mux", "version": "v1.8.0", "type": "direct", "source": "go", "is_vulnerable": False, "is_outdated": False},
            {"name": "go-redis/redis", "version": "v8.11.4", "type": "direct", "source": "go", "is_vulnerable": False, "is_outdated": True},
            {"name": "opentracing/opentracing-go", "version": "v1.2.0", "type": "direct", "source": "go", "is_vulnerable": False, "is_outdated": False}
        ])
    
    # Python dependencies
    if "Python" in language_counts:
        dependencies.extend([
            {"name": "grpcio", "version": "1.44.0", "type": "direct", "source": "pip", "is_vulnerable": False, "is_outdated": True},
            {"name": "protobuf", "version": "3.19.4", "type": "direct", "source": "pip", "is_vulnerable": True, "is_outdated": True},
            {"name": "flask", "version": "2.0.1", "type": "direct", "source": "pip", "is_vulnerable": False, "is_outdated": True},
            {"name": "requests", "version": "2.27.1", "type": "direct", "source": "pip", "is_vulnerable": False, "is_outdated": False},
            {"name": "opentelemetry-api", "version": "1.9.1", "type": "direct", "source": "pip", "is_vulnerable": False, "is_outdated": False},
            {"name": "opentelemetry-sdk", "version": "1.9.1", "type": "direct", "source": "pip", "is_vulnerable": False, "is_outdated": False},
            {"name": "redis", "version": "4.1.4", "type": "direct", "source": "pip", "is_vulnerable": False, "is_outdated": False}
        ])
    
    # Node.js dependencies
    if "Node.js" in language_counts:
        dependencies.extend([
            {"name": "@grpc/grpc-js", "version": "1.6.7", "type": "direct", "source": "npm", "is_vulnerable": False, "is_outdated": True},
            {"name": "google-protobuf", "version": "3.20.0", "type": "direct", "source": "npm", "is_vulnerable": False, "is_outdated": False},
            {"name": "express", "version": "4.17.3", "type": "direct", "source": "npm", "is_vulnerable": True, "is_outdated": True},
            {"name": "pino", "version": "7.8.0", "type": "direct", "source": "npm", "is_vulnerable": False, "is_outdated": False},
            {"name": "redis", "version": "4.0.4", "type": "direct", "source": "npm", "is_vulnerable": False, "is_outdated": False},
            {"name": "axios", "version": "0.26.1", "type": "direct", "source": "npm", "is_vulnerable": True, "is_outdated": True}
        ])
    
    # Java dependencies
    if "Java" in language_counts:
        dependencies.extend([
            {"name": "io.grpc:grpc-netty", "version": "1.45.1", "type": "direct", "source": "maven", "is_vulnerable": False, "is_outdated": False},
            {"name": "io.grpc:grpc-protobuf", "version": "1.45.1", "type": "direct", "source": "maven", "is_vulnerable": False, "is_outdated": False},
            {"name": "org.springframework.boot:spring-boot-starter-web", "version": "2.6.4", "type": "direct", "source": "maven", "is_vulnerable": False, "is_outdated": True},
            {"name": "org.springframework.boot:spring-boot-starter-data-redis", "version": "2.6.4", "type": "direct", "source": "maven", "is_vulnerable": False, "is_outdated": True},
            {"name": "io.opentelemetry:opentelemetry-api", "version": "1.12.0", "type": "direct", "source": "maven", "is_vulnerable": False, "is_outdated": False},
            {"name": "io.opentelemetry:opentelemetry-sdk", "version": "1.12.0", "type": "direct", "source": "maven", "is_vulnerable": False, "is_outdated": False},
            {"name": "org.hibernate:hibernate-core", "version": "5.6.5.Final", "type": "direct", "source": "maven", "is_vulnerable": True, "is_outdated": True}
        ])
    
    # C# dependencies
    if "C#" in language_counts:
        dependencies.extend([
            {"name": "Grpc.Net.Client", "version": "2.45.0", "type": "direct", "source": "nuget", "is_vulnerable": False, "is_outdated": False},
            {"name": "Google.Protobuf", "version": "3.20.0", "type": "direct", "source": "nuget", "is_vulnerable": False, "is_outdated": False},
            {"name": "Microsoft.AspNetCore.App", "version": "6.0.3", "type": "direct", "source": "nuget", "is_vulnerable": False, "is_outdated": False},
            {"name": "Microsoft.EntityFrameworkCore", "version": "6.0.3", "type": "direct", "source": "nuget", "is_vulnerable": False, "is_outdated": False},
            {"name": "StackExchange.Redis", "version": "2.5.43", "type": "direct", "source": "nuget", "is_vulnerable": False, "is_outdated": False},
            {"name": "Newtonsoft.Json", "version": "13.0.1", "type": "direct", "source": "nuget", "is_vulnerable": True, "is_outdated": False}
        ])
    
    # Add transitive dependencies
    dependencies.extend([
        {"name": "log4j-core", "version": "2.14.1", "type": "transitive", "source": "maven", "is_vulnerable": True, "is_outdated": True},
        {"name": "minimist", "version": "1.2.5", "type": "transitive", "source": "npm", "is_vulnerable": True, "is_outdated": True},
        {"name": "lodash", "version": "4.17.19", "type": "transitive", "source": "npm", "is_vulnerable": True, "is_outdated": True},
        {"name": "urllib3", "version": "1.26.8", "type": "transitive", "source": "pip", "is_vulnerable": False, "is_outdated": True},
        {"name": "github.com/pkg/errors", "version": "v0.9.1", "type": "transitive", "source": "go", "is_vulnerable": False, "is_outdated": False}
    ])
    
    # Create mock APIs
    apis = []
    for service in MICROSERVICES:
        apis.append({
            "path": f"/{service['name']}/v1",
            "method": "gRPC",
            "description": f"{service['description']}"
        })
    
    # Create mock infrastructure
    pipelines = [
        {"name": "CI/CD Pipeline", "type": "github-actions", "path": ".github/workflows/ci.yml", "status": "active"},
        {"name": "Release Pipeline", "type": "github-actions", "path": ".github/workflows/release.yml", "status": "active"},
        {"name": "Nightly Build", "type": "github-actions", "path": ".github/workflows/nightly.yml", "status": "inactive"},
        {"name": "Integration Tests", "type": "jenkins", "path": "Jenkinsfile", "status": "active"},
        {"name": "Performance Tests", "type": "gitlab-ci", "path": ".gitlab-ci.yml", "status": "active"}
    ]
    
    artifacts = []
    for service in MICROSERVICES:
        artifacts.append({
            "name": service["name"],
            "type": "docker",
            "path": f"gcr.io/microservices-demo/{service['name']}"
        })
    
    # Create the inventory data structure
    inventory_data = {
        "repository": {
            "name": "microservices-demo",
            "full_name": "GoogleCloudPlatform/microservices-demo",
            "description": "Sample cloud-first application with 10 microservices showcasing Kubernetes, Istio, and gRPC.",
            "owner": "GoogleCloudPlatform",
            "private": False,
            "fork": False,
            "size": 35945,
            "stargazers_count": 14500,
            "forks_count": 3200,
            "open_issues_count": 42,
            "created_at": "2018-08-03T18:32:18Z",
            "updated_at": "2025-09-03T08:56:31Z",
            "pushed_at": "2025-08-26T20:41:12Z",
            "default_branch": "main",
            "topics": ["gcp", "gke", "google-cloud", "grpc", "istio", "kubernetes", "kustomize", "sample-application", "samples", "skaffold", "terraform"],
            "license": {
                "key": "apache-2.0",
                "name": "Apache License 2.0"
            },
            "url": "https://github.com/GoogleCloudPlatform/microservices-demo",
            "clone_url": "https://github.com/GoogleCloudPlatform/microservices-demo.git"
        },
        "technologies": {
            "languages": language_bytes,
            "frameworks": frameworks,
            "databases": [
                {"name": "Redis", "category": "database", "confidence": 0.9},
                {"name": "MongoDB", "category": "database", "confidence": 0.6},
                {"name": "PostgreSQL", "category": "database", "confidence": 0.5}
            ],
            "cloud_platforms": [
                {"name": "Google Cloud Platform", "category": "cloud", "confidence": 0.9},
                {"name": "Kubernetes", "category": "orchestration", "confidence": 1.0},
                {"name": "Google Kubernetes Engine", "category": "cloud", "confidence": 0.85},
                {"name": "Cloud Run", "category": "serverless", "confidence": 0.7}
            ],
            "tools": technologies,
            "primary_language": max(language_counts.items(), key=lambda x: x[1])[0],
            "language_distribution": language_distribution
        },
        "dependencies": {
            "dependencies": dependencies,
            "total_count": len(dependencies),
            "vulnerable_count": sum(1 for dep in dependencies if dep.get('is_vulnerable', False)),
            "outdated_count": sum(1 for dep in dependencies if dep.get('is_outdated', False)),
            "license_distribution": {"Apache-2.0": 45, "MIT": 30, "BSD-3-Clause": 15, "GPL-3.0": 5, "LGPL-2.1": 3, "Proprietary": 2},
            "source_distribution": {"go": 20, "pip": 25, "npm": 20, "maven": 25, "nuget": 10}
        },
        "apis": {
            "endpoints": apis,
            "rest_apis": [],
            "graphql_schemas": [],
            "grpc_services": apis,
            "openapi_specs": []
        },
        "security": {
            "sensitive_data": [],
            "sensitive_data_count": 0,
            "security_issues": []
        },
        "infrastructure": {
            "pipelines": pipelines,
            "artifacts": artifacts,
            "infrastructure": [
                {"type": "kubernetes", "resources": ["Deployment", "Service"], "providers": ["GKE"], "environments": ["dev", "prod"]}
            ]
        },
        "services": {
            "services": [
                {"name": service["name"], "language": service["language"], "description": service["description"], "markers": ["microservice"], "path": f"/src/{service['name']}"}
                for service in MICROSERVICES
            ]
        },
        "analysis_timestamp": datetime.now().isoformat()
    }
    
    return inventory_data

def generate_repository_activity():
    """Generate sample repository activity data"""
    print("Generating sample repository activity data...")
    
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
    pr_details = []
    for i in range(1, 6):  # Generate 5 PRs
        pr_number = 3000 + i
        
        # Determine state and dates
        state = random.choice(["open", "closed"])
        created_at = (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat()
        updated_at = (datetime.now() - timedelta(days=random.randint(0, 10))).isoformat()
        closed_at = (datetime.now() - timedelta(days=random.randint(0, 9))).isoformat() if state == "closed" else None
        merged_at = (datetime.now() - timedelta(days=random.randint(0, 8))).isoformat() if state == "closed" and random.random() > 0.3 else None
        
        # Select author
        author = random.choice(authors)
        
        # Generate PR data
        title = random.choice(titles)
        if "dependencies" in title.lower() and random.random() > 0.5:
            title += f" to v{random.randint(1, 10)}.{random.randint(0, 20)}.{random.randint(0, 99)}"
        
        # Generate commits
        commit_count = random.randint(1, 3)
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
        file_count = random.randint(1, 3)
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
        
        pr_details.append(pr_info)
    
    # Create result object
    activity_data = {
        "repository": {
            "owner": "GoogleCloudPlatform",
            "name": "microservices-demo",
            "full_name": "GoogleCloudPlatform/microservices-demo"
        },
        "summary": {
            "total_pull_requests": 3070,
            "total_commits": 5432,
            "latest_pr_count": len(pr_details),
            "latest_pr_commits": sum(pr["commit_count"] for pr in pr_details)
        },
        "pull_requests": {
            "count": len(pr_details),
            "details": pr_details
        },
        "timestamp": datetime.now().isoformat()
    }
    
    return activity_data

def main():
    """Main function to generate sample data"""
    print("Generating sample data for the React dashboard...")
    
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Generate microservices inventory data
    inventory_data = generate_microservices_inventory()
    
    # Generate repository activity data
    activity_data = generate_repository_activity()
    
    # Save microservices inventory data
    inventory_path = os.path.join(OUTPUT_DIR, "microservices_inventory.json")
    with open(inventory_path, 'w') as f:
        json.dump(inventory_data, f, indent=2, default=str)
    
    # Save repository activity data
    activity_path = os.path.join(OUTPUT_DIR, "repo_activity_summary.json")
    with open(activity_path, 'w') as f:
        json.dump(activity_data, f, indent=2, default=str)
    
    print(f"Sample data generated successfully!")
    print(f"Microservices inventory data saved to: {inventory_path}")
    print(f"Repository activity data saved to: {activity_path}")

if __name__ == "__main__":
    main()
