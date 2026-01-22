#!/usr/bin/env python3
"""
Base Images Data Generator for Microservices Dashboard

This script generates base image data for the microservices dashboard.
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

# Base image types
BASE_IMAGE_TYPES = [
    "node", "python", "java", "dotnet", "golang", "ruby", "php", 
    "nginx", "alpine", "ubuntu", "debian", "centos", "fedora", "amazonlinux"
]

# Vulnerability types
VULNERABILITY_TYPES = [
    "Remote Code Execution", "SQL Injection", "Cross-Site Scripting", 
    "Path Traversal", "Denial of Service", "Information Disclosure", 
    "Privilege Escalation", "Buffer Overflow", "Memory Leak", 
    "Insecure Deserialization", "XML External Entity", "Server-Side Request Forgery"
]

# Components that might have vulnerabilities
COMPONENTS = [
    "openssl", "glibc", "libxml2", "curl", "openssh", "bash", "python", 
    "nodejs", "openjdk", "dotnet", "nginx", "apache", "mysql", "postgresql", 
    "redis", "mongodb", "libc", "libcurl", "libpng", "libjpeg", "zlib"
]

# Microservices that might use the base images
MICROSERVICES = [
    "frontend", "backend", "api", "auth", "database", "cache", "queue", 
    "worker", "scheduler", "notification", "payment", "shipping", "inventory"
]

def generate_vulnerability(severity=None):
    """Generate a vulnerability"""
    if not severity:
        severity = random.choice(["Critical", "High", "Medium", "Low"])
    
    # Generate a CVE ID
    year = random.randint(2020, 2023)
    cve_id = f"CVE-{year}-{random.randint(10000, 99999)}"
    
    # Generate component information
    component = random.choice(COMPONENTS)
    component_version = f"{random.randint(0, 5)}.{random.randint(0, 20)}.{random.randint(0, 50)}"
    
    # Generate a CVSS score based on severity
    cvss_score = 0
    if severity == "Critical":
        cvss_score = round(random.uniform(9.0, 10.0), 1)
    elif severity == "High":
        cvss_score = round(random.uniform(7.0, 8.9), 1)
    elif severity == "Medium":
        cvss_score = round(random.uniform(4.0, 6.9), 1)
    else:  # Low
        cvss_score = round(random.uniform(0.1, 3.9), 1)
    
    # Generate dates
    published_date = datetime.now() - timedelta(days=random.randint(30, 365))
    
    # Determine if there's a fix available
    has_fix = random.choice([True, False])
    fixed_version = None
    if has_fix:
        # Generate a fixed version that's higher than the current version
        version_parts = component_version.split('.')
        if len(version_parts) >= 3:
            fixed_version = f"{version_parts[0]}.{version_parts[1]}.{int(version_parts[2]) + random.randint(1, 5)}"
        else:
            fixed_version = f"{component_version}.1"
    
    return {
        "id": cve_id,
        "title": f"{random.choice(VULNERABILITY_TYPES)} in {component}",
        "description": f"A {severity.lower()} severity {random.choice(VULNERABILITY_TYPES).lower()} vulnerability was found in {component} version {component_version} that allows attackers to {random.choice(['execute arbitrary code', 'access sensitive information', 'cause denial of service', 'bypass authentication', 'escalate privileges'])}.",
        "severity": severity,
        "cvss_score": cvss_score,
        "component": component,
        "component_version": component_version,
        "fixed_version": fixed_version,
        "published_date": published_date.strftime("%Y-%m-%d"),
        "remediation": random.choice([
            "Upgrade to latest version",
            "Apply security patch",
            "Replace with secure alternative",
            "Configure security settings",
            "Remove unused component"
        ])
    }

def generate_base_image():
    """Generate a base image with vulnerabilities"""
    image_type = random.choice(BASE_IMAGE_TYPES)
    tag = f"{random.randint(1, 20)}.{random.randint(0, 20)}"
    
    # Generate vulnerabilities
    vulnerabilities = []
    num_vulnerabilities = random.randint(0, 10)
    for _ in range(num_vulnerabilities):
        vulnerabilities.append(generate_vulnerability())
    
    # Count vulnerabilities by severity
    critical_count = sum(1 for v in vulnerabilities if v["severity"] == "Critical")
    high_count = sum(1 for v in vulnerabilities if v["severity"] == "High")
    medium_count = sum(1 for v in vulnerabilities if v["severity"] == "Medium")
    low_count = sum(1 for v in vulnerabilities if v["severity"] == "Low")
    
    # Calculate security score
    security_score = 100
    if len(vulnerabilities) > 0:
        security_score -= critical_count * 15
        security_score -= high_count * 7
        security_score -= medium_count * 3
        security_score -= low_count * 1
        security_score = max(0, security_score)
    
    # Generate usage information
    used_by = []
    num_usages = random.randint(1, 5)
    for _ in range(num_usages):
        used_by.append(random.choice(MICROSERVICES))
    
    # Remove duplicates
    used_by = list(set(used_by))
    
    # Generate update information
    last_updated = datetime.now() - timedelta(days=random.randint(0, 365))
    next_update = datetime.now() + timedelta(days=random.randint(1, 90))
    
    return {
        "name": image_type,
        "tag": tag,
        "full_name": f"{image_type}:{tag}",
        "size": f"{random.randint(10, 500)}MB",
        "layers": random.randint(3, 15),
        "created": (datetime.now() - timedelta(days=random.randint(0, 365))).strftime("%Y-%m-%d"),
        "registry": random.choice(["Docker Hub", "GitHub Container Registry", "Google Container Registry", "Amazon ECR", "Azure Container Registry"]),
        "vulnerabilities": vulnerabilities,
        "vulnerability_counts": {
            "critical": critical_count,
            "high": high_count,
            "medium": medium_count,
            "low": low_count,
            "total": len(vulnerabilities)
        },
        "security_score": security_score,
        "scan_date": (datetime.now() - timedelta(days=random.randint(0, 30))).strftime("%Y-%m-%d"),
        "used_by": used_by,
        "last_updated": last_updated.strftime("%Y-%m-%d"),
        "next_update": next_update.strftime("%Y-%m-%d"),
        "update_frequency": random.choice(["Weekly", "Monthly", "Quarterly"]),
        "is_latest": random.choice([True, False]),
        "is_recommended": random.choice([True, False]),
        "is_deprecated": random.choice([True, False]),
        "alternatives": [
            f"{image_type}:{random.randint(1, 20)}.{random.randint(0, 20)}",
            f"{image_type}:{random.randint(1, 20)}.{random.randint(0, 20)}"
        ]
    }

def generate_base_images_data():
    """Generate base images data"""
    # Generate base images
    base_images = []
    num_images = random.randint(10, 20)
    for _ in range(num_images):
        base_images.append(generate_base_image())
    
    # Calculate summary statistics
    total_images = len(base_images)
    vulnerable_images = sum(1 for img in base_images if img["vulnerability_counts"]["total"] > 0)
    deprecated_images = sum(1 for img in base_images if img["is_deprecated"])
    outdated_images = sum(1 for img in base_images if not img["is_latest"])
    
    # Count vulnerabilities by severity
    critical_vulnerabilities = sum(img["vulnerability_counts"]["critical"] for img in base_images)
    high_vulnerabilities = sum(img["vulnerability_counts"]["high"] for img in base_images)
    medium_vulnerabilities = sum(img["vulnerability_counts"]["medium"] for img in base_images)
    low_vulnerabilities = sum(img["vulnerability_counts"]["low"] for img in base_images)
    total_vulnerabilities = critical_vulnerabilities + high_vulnerabilities + medium_vulnerabilities + low_vulnerabilities
    
    # Count images by type
    image_types = {}
    for img in base_images:
        if img["name"] in image_types:
            image_types[img["name"]] += 1
        else:
            image_types[img["name"]] = 1
    
    return {
        "base_images": base_images,
        "summary": {
            "total_images": total_images,
            "vulnerable_images": vulnerable_images,
            "deprecated_images": deprecated_images,
            "outdated_images": outdated_images,
            "vulnerabilities": {
                "critical": critical_vulnerabilities,
                "high": high_vulnerabilities,
                "medium": medium_vulnerabilities,
                "low": low_vulnerabilities,
                "total": total_vulnerabilities
            },
            "image_types": image_types
        },
        "timestamp": datetime.now().isoformat()
    }

def main():
    """Main function to generate and save base images data"""
    print("Generating base images data...")
    
    # Generate data
    data = generate_base_images_data()
    
    # Save data
    output_paths = [
        os.path.join(OUTPUT_DIR, "base_images_data.json"),
        os.path.join(REACT_DATA_DIR, "base_images_data.json"),
        os.path.join(PUBLIC_DATA_DIR, "base_images_data.json")
    ]
    
    for path in output_paths:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        with open(path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"Base images data saved to: {path}")
    
    print("Base images data generation complete.")

if __name__ == "__main__":
    main()
