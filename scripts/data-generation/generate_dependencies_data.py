#!/usr/bin/env python3
"""
Dependencies Data Generator for Microservices Dashboard

This script generates dependencies data for the microservices dashboard.
"""

import os
import json
import random
from datetime import datetime, timedelta

# Output directories
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
REACT_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "react-dashboard/src/data")
PUBLIC_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "react-dashboard/public/data")

# Ensure output directories exist
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(REACT_DATA_DIR, exist_ok=True)
os.makedirs(PUBLIC_DATA_DIR, exist_ok=True)

# Common licenses
LICENSES = [
    "MIT", "Apache-2.0", "GPL-3.0", "BSD-3-Clause", "LGPL-2.1", 
    "MPL-2.0", "EPL-2.0", "AGPL-3.0", "Unlicense", "ISC"
]

# Package managers
PACKAGE_MANAGERS = {
    "npm": ["react", "lodash", "express", "moment", "axios", "jquery", "bootstrap", "vue", "angular", "redux"],
    "pip": ["numpy", "pandas", "requests", "django", "flask", "tensorflow", "pytorch", "matplotlib", "scipy", "sqlalchemy"],
    "maven": ["spring-boot", "hibernate", "log4j", "gson", "jackson", "guava", "netty", "junit", "mockito", "lombok"],
    "nuget": ["newtonsoft.json", "entity-framework", "xunit", "moq", "automapper", "fluentvalidation", "serilog", "nlog", "mediatr", "dapper"],
    "gradle": ["kotlin-stdlib", "coroutines", "ktor", "exposed", "kotest", "mockk", "kotlinx-serialization", "koin", "arrow", "kotlinx-datetime"],
    "cargo": ["serde", "tokio", "actix-web", "reqwest", "diesel", "rocket", "clap", "warp", "axum", "sqlx"],
    "go": ["gorilla/mux", "gin-gonic/gin", "spf13/cobra", "gorm", "fiber", "echo", "zap", "testify", "viper", "jwt-go"],
    "docker": ["nginx", "node", "python", "java", "dotnet", "golang", "ruby", "php", "alpine", "ubuntu"]
}

# Dependency types
DEPENDENCY_TYPES = ["runtime", "development", "optional", "peer", "bundled"]

# Vulnerability types
VULNERABILITY_TYPES = [
    "Remote Code Execution", "SQL Injection", "Cross-Site Scripting", 
    "Path Traversal", "Denial of Service", "Information Disclosure", 
    "Privilege Escalation", "Buffer Overflow", "Memory Leak", 
    "Insecure Deserialization", "XML External Entity", "Server-Side Request Forgery"
]

def generate_vulnerability(package_name, package_version):
    """Generate a vulnerability for a package"""
    severity = random.choice(["Critical", "High", "Medium", "Low"])
    
    # Generate a CVE ID
    year = random.randint(2020, 2023)
    cve_id = f"CVE-{year}-{random.randint(10000, 99999)}"
    
    # Generate dates
    published_date = datetime.now() - timedelta(days=random.randint(30, 365))
    
    # Determine if there's a fix available
    has_fix = random.choice([True, False])
    fixed_version = None
    if has_fix:
        # Generate a fixed version that's higher than the current version
        version_parts = package_version.split('.')
        if len(version_parts) >= 3:
            fixed_version = f"{version_parts[0]}.{version_parts[1]}.{int(version_parts[2]) + random.randint(1, 5)}"
        else:
            fixed_version = f"{package_version}.1"
    
    return {
        "id": cve_id,
        "title": f"{random.choice(VULNERABILITY_TYPES)} in {package_name}",
        "description": f"A {severity.lower()} severity {random.choice(VULNERABILITY_TYPES).lower()} vulnerability was found in {package_name} version {package_version} that allows attackers to {random.choice(['execute arbitrary code', 'access sensitive information', 'cause denial of service', 'bypass authentication', 'escalate privileges'])}.",
        "severity": severity,
        "affected_versions": f"<= {package_version}",
        "fixed_version": fixed_version,
        "published_date": published_date.strftime("%Y-%m-%d"),
        "references": [
            f"https://nvd.nist.gov/vuln/detail/{cve_id}",
            f"https://github.com/advisories/{cve_id.lower()}"
        ]
    }

def generate_dependency():
    """Generate a dependency"""
    # Select package manager
    package_manager = random.choice(list(PACKAGE_MANAGERS.keys()))
    
    # Select package
    package_name = random.choice(PACKAGE_MANAGERS[package_manager])
    
    # Generate version
    version = f"{random.randint(0, 5)}.{random.randint(0, 20)}.{random.randint(0, 50)}"
    
    # Generate latest version
    version_parts = version.split('.')
    latest_version = f"{version_parts[0]}.{int(version_parts[1]) + random.randint(0, 3)}.{int(version_parts[2]) + random.randint(1, 10)}"
    
    # Determine if outdated
    is_outdated = version != latest_version
    
    # Determine if vulnerable
    is_vulnerable = random.random() < 0.3  # 30% chance of being vulnerable
    
    # Generate vulnerabilities
    vulnerabilities = []
    if is_vulnerable:
        num_vulnerabilities = random.randint(1, 3)
        for _ in range(num_vulnerabilities):
            vulnerabilities.append(generate_vulnerability(package_name, version))
    
    # Generate license
    license_name = random.choice(LICENSES)
    
    # Generate dependency type
    dependency_type = random.choice(DEPENDENCY_TYPES)
    
    # Generate usage information
    usage = []
    num_usages = random.randint(1, 5)
    for _ in range(num_usages):
        usage.append({
            "service": random.choice(["frontend", "backend", "api", "auth", "database", "cache", "queue", "worker", "scheduler", "notification"]),
            "file": f"src/{random.choice(['main', 'index', 'app', 'server', 'client', 'utils', 'helpers', 'models', 'controllers', 'views'])}.{random.choice(['js', 'py', 'java', 'cs', 'go', 'rs', 'rb', 'php', 'ts', 'swift'])}",
            "type": random.choice(["Direct", "Transitive"])
        })
    
    return {
        "name": package_name,
        "version": version,
        "latest_version": latest_version,
        "type": dependency_type,
        "license": license_name,
        "source": package_manager,
        "is_vulnerable": is_vulnerable,
        "is_outdated": is_outdated,
        "vulnerabilities": vulnerabilities,
        "usage": usage,
        "last_updated": (datetime.now() - timedelta(days=random.randint(0, 180))).strftime("%Y-%m-%d")
    }

def generate_dependencies_data():
    """Generate dependencies data"""
    # Generate dependencies
    dependencies = []
    num_dependencies = random.randint(30, 50)
    for _ in range(num_dependencies):
        dependencies.append(generate_dependency())
    
    # Calculate summary statistics
    total_count = len(dependencies)
    vulnerable_count = sum(1 for dep in dependencies if dep["is_vulnerable"])
    outdated_count = sum(1 for dep in dependencies if dep["is_outdated"])
    
    # Count licenses
    license_distribution = {}
    for dep in dependencies:
        if dep["license"] in license_distribution:
            license_distribution[dep["license"]] += 1
        else:
            license_distribution[dep["license"]] = 1
    
    # Count sources
    source_distribution = {}
    for dep in dependencies:
        if dep["source"] in source_distribution:
            source_distribution[dep["source"]] += 1
        else:
            source_distribution[dep["source"]] = 1
    
    # Count types
    type_distribution = {}
    for dep in dependencies:
        if dep["type"] in type_distribution:
            type_distribution[dep["type"]] += 1
        else:
            type_distribution[dep["type"]] = 1
    
    return {
        "dependencies": dependencies,
        "total_count": total_count,
        "vulnerable_count": vulnerable_count,
        "outdated_count": outdated_count,
        "license_distribution": license_distribution,
        "source_distribution": source_distribution,
        "type_distribution": type_distribution,
        "timestamp": datetime.now().isoformat()
    }

def main():
    """Main function to generate and save dependencies data"""
    print("Generating dependencies data...")
    
    # Generate data
    data = generate_dependencies_data()
    
    # Save data
    output_paths = [
        os.path.join(OUTPUT_DIR, "dependencies_data.json"),
        os.path.join(REACT_DATA_DIR, "dependencies_data.json"),
        os.path.join(PUBLIC_DATA_DIR, "dependencies_data.json")
    ]
    
    for path in output_paths:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        with open(path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"Dependencies data saved to: {path}")
    
    print("Dependencies data generation complete.")

if __name__ == "__main__":
    main()
