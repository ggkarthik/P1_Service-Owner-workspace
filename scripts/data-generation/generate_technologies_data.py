#!/usr/bin/env python3
"""
Technologies Data Generator for Microservices Dashboard

This script generates technologies data for the microservices dashboard.
"""

import os
import json
import random
from datetime import datetime

# Output directories
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
REACT_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "react-dashboard/src/data")
PUBLIC_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "react-dashboard/public/data")

# Ensure output directories exist
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(REACT_DATA_DIR, exist_ok=True)
os.makedirs(PUBLIC_DATA_DIR, exist_ok=True)

# Programming languages
LANGUAGES = {
    "JavaScript": ["React", "Angular", "Vue", "Express", "Next.js", "Gatsby"],
    "Python": ["Django", "Flask", "FastAPI", "Pyramid", "Tornado"],
    "Java": ["Spring Boot", "Quarkus", "Micronaut", "Jakarta EE", "Hibernate"],
    "Go": ["Gin", "Echo", "Fiber", "Gorilla", "Buffalo"],
    "Ruby": ["Rails", "Sinatra", "Hanami", "Grape", "Padrino"],
    "TypeScript": ["NestJS", "Angular", "React", "Vue", "Express"],
    "C#": ["ASP.NET Core", "Entity Framework", "Blazor", "MVC", "Xamarin"],
    "PHP": ["Laravel", "Symfony", "CodeIgniter", "Yii", "CakePHP"],
    "Rust": ["Actix", "Rocket", "Warp", "Tide", "Axum"],
    "Kotlin": ["Spring Boot", "Ktor", "Micronaut", "Quarkus", "Android SDK"]
}

# Databases
DATABASES = [
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Cassandra", 
    "DynamoDB", "SQLite", "Oracle", "SQL Server", "Elasticsearch",
    "Neo4j", "CouchDB", "MariaDB", "Firebase", "InfluxDB"
]

# Cloud platforms
CLOUD_PLATFORMS = [
    "AWS", "Azure", "Google Cloud", "Heroku", "DigitalOcean",
    "IBM Cloud", "Oracle Cloud", "Alibaba Cloud", "Linode", "Vultr"
]

# Development tools
TOOLS = [
    "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "CircleCI",
    "Terraform", "Ansible", "Prometheus", "Grafana", "ELK Stack",
    "Git", "Jira", "Confluence", "Slack", "Notion",
    "VS Code", "IntelliJ IDEA", "PyCharm", "WebStorm", "Eclipse"
]

def generate_technologies_data():
    """Generate technologies data"""
    # Select primary language
    primary_language = random.choice(list(LANGUAGES.keys()))
    
    # Generate language distribution
    language_distribution = {}
    total_percentage = 100
    remaining_languages = list(LANGUAGES.keys())
    remaining_languages.remove(primary_language)
    
    # Assign percentage to primary language (40-70%)
    primary_percentage = random.randint(40, 70)
    language_distribution[primary_language] = primary_percentage
    total_percentage -= primary_percentage
    
    # Assign percentages to other languages
    num_other_languages = random.randint(2, min(5, len(remaining_languages)))
    selected_languages = random.sample(remaining_languages, num_other_languages)
    
    for i, lang in enumerate(selected_languages):
        if i == len(selected_languages) - 1:
            # Last language gets the remainder
            language_distribution[lang] = total_percentage
        else:
            # Assign a random percentage
            percentage = random.randint(5, total_percentage - 5 * (len(selected_languages) - i - 1))
            language_distribution[lang] = percentage
            total_percentage -= percentage
    
    # Generate languages data with lines of code
    languages = {}
    total_loc = random.randint(10000, 100000)
    for lang, percentage in language_distribution.items():
        languages[lang] = int(total_loc * percentage / 100)
    
    # Generate frameworks
    frameworks = []
    for lang, percentage in language_distribution.items():
        num_frameworks = random.randint(1, 3)
        if lang in LANGUAGES:
            available_frameworks = LANGUAGES[lang]
            selected_frameworks = random.sample(available_frameworks, min(num_frameworks, len(available_frameworks)))
            for framework in selected_frameworks:
                frameworks.append({
                    "name": framework,
                    "language": lang,
                    "version": f"{random.randint(1, 10)}.{random.randint(0, 20)}.{random.randint(0, 50)}",
                    "usage": random.randint(1, 10)
                })
    
    # Generate databases
    num_databases = random.randint(2, 5)
    selected_databases = random.sample(DATABASES, num_databases)
    databases = []
    for db in selected_databases:
        databases.append({
            "name": db,
            "version": f"{random.randint(1, 20)}.{random.randint(0, 50)}",
            "usage": random.randint(1, 10)
        })
    
    # Generate cloud platforms
    num_cloud_platforms = random.randint(1, 3)
    selected_cloud_platforms = random.sample(CLOUD_PLATFORMS, num_cloud_platforms)
    cloud_platforms = []
    for platform in selected_cloud_platforms:
        cloud_platforms.append({
            "name": platform,
            "services": random.randint(3, 15),
            "usage": random.randint(1, 10)
        })
    
    # Generate tools
    num_tools = random.randint(5, 10)
    selected_tools = random.sample(TOOLS, num_tools)
    tools = []
    for tool in selected_tools:
        tools.append({
            "name": tool,
            "category": random.choice(["CI/CD", "Monitoring", "Development", "Collaboration", "Infrastructure"]),
            "usage": random.randint(1, 10)
        })
    
    return {
        "languages": languages,
        "language_distribution": language_distribution,
        "primary_language": primary_language,
        "frameworks": frameworks,
        "databases": databases,
        "cloud_platforms": cloud_platforms,
        "tools": tools,
        "timestamp": datetime.now().isoformat()
    }

def main():
    """Main function to generate and save technologies data"""
    print("Generating technologies data...")
    
    # Generate data
    data = generate_technologies_data()
    
    # Save data
    output_paths = [
        os.path.join(OUTPUT_DIR, "technologies_data.json"),
        os.path.join(REACT_DATA_DIR, "technologies_data.json"),
        os.path.join(PUBLIC_DATA_DIR, "technologies_data.json")
    ]
    
    for path in output_paths:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        with open(path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"Technologies data saved to: {path}")
    
    print("Technologies data generation complete.")

if __name__ == "__main__":
    main()
