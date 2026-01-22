#!/usr/bin/env python3
"""
Open Source Security Data Generator for Microservices Dashboard

This script generates open source security data for the microservices dashboard.
It creates data about vulnerabilities in packages, libraries, and images.
"""

import os
import sys
import json
import random
import logging
from datetime import datetime, timedelta

# Import centralized configuration
try:
    from config import (
        get_all_output_paths,
        SAMPLE_SIZE,
        VULNERABILITY_DISTRIBUTION,
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

# Common vulnerability types
VULNERABILITY_TYPES = [
    "Remote Code Execution",
    "SQL Injection",
    "Cross-Site Scripting",
    "Path Traversal",
    "Denial of Service",
    "Information Disclosure",
    "Privilege Escalation",
    "Buffer Overflow",
    "Memory Leak",
    "Insecure Deserialization",
    "XML External Entity",
    "Server-Side Request Forgery",
    "Command Injection",
    "Authentication Bypass",
    "Cryptographic Issues"
]

# Common licenses
LICENSES = [
    "MIT", "Apache-2.0", "GPL-3.0", "BSD-3-Clause", "LGPL-2.1", 
    "MPL-2.0", "EPL-2.0", "AGPL-3.0", "Unlicense", "ISC"
]

# Common package managers
PACKAGE_MANAGERS = [
    "npm", "pip", "maven", "nuget", "gradle", "cargo", "go", "docker"
]

# Common remediation actions
REMEDIATION_ACTIONS = [
    "Upgrade to latest version",
    "Apply security patch",
    "Replace with secure alternative",
    "Add security wrapper",
    "Configure security settings",
    "Implement input validation",
    "Update dependencies",
    "Remove unused dependency"
]

def generate_vulnerability(package_name, package_version, severity=None):
    """Generate a vulnerability for a package"""
    if not severity:
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
    
    return {
        "id": cve_id,
        "title": f"{random.choice(VULNERABILITY_TYPES)} in {package_name}",
        "description": f"A {severity.lower()} severity {random.choice(VULNERABILITY_TYPES).lower()} vulnerability was found in {package_name} version {package_version} that allows attackers to {random.choice(['execute arbitrary code', 'access sensitive information', 'cause denial of service', 'bypass authentication', 'escalate privileges'])}.",
        "severity": severity,
        "cvss_score": cvss_score,
        "affected_versions": f"<= {package_version}",
        "fixed_version": fixed_version,
        "published_date": published_date.strftime("%Y-%m-%d"),
        "references": [
            f"https://nvd.nist.gov/vuln/detail/{cve_id}",
            f"https://github.com/advisories/{cve_id.lower()}"
        ],
        "remediation": random.choice(REMEDIATION_ACTIONS),
        "exploit_available": random.choice([True, False]),
        "exploit_maturity": random.choice(["Proof of Concept", "Functional", "High", "Not Defined"]) if random.choice([True, False]) else None
    }

def generate_package(name=None, version=None, language=None, is_vulnerable=None, is_outdated=None):
    """Generate a package with vulnerabilities"""
    if not name:
        name = f"{random.choice(['react', 'lodash', 'express', 'moment', 'axios', 'jquery', 'bootstrap', 'vue', 'angular', 'tensorflow', 'numpy', 'requests', 'django', 'flask', 'spring', 'hibernate', 'log4j', 'gson', 'jackson', 'guava', 'netty', 'okhttp', 'retrofit', 'newtonsoft', 'entity-framework', 'xunit', 'moq'])}-{random.randint(1, 100)}"
    
    if not version:
        version = f"{random.randint(0, 5)}.{random.randint(0, 20)}.{random.randint(0, 50)}"
    
    if not language:
        language = random.choice(["JavaScript", "Python", "Java", "C#", "Go", "Rust", "Ruby", "PHP", "TypeScript", "Swift"])
    
    if is_vulnerable is None:
        is_vulnerable = random.random() < 0.3  # 30% chance of being vulnerable
    
    if is_outdated is None:
        is_outdated = random.random() < 0.4  # 40% chance of being outdated
    
    # Generate latest version
    version_parts = version.split('.')
    if len(version_parts) >= 3:
        latest_version = f"{version_parts[0]}.{int(version_parts[1]) + random.randint(0, 3)}.{int(version_parts[2]) + random.randint(1, 10)}"
    else:
        latest_version = f"{version}.{random.randint(1, 10)}"
    
    # Generate vulnerabilities
    vulnerabilities = []
    if is_vulnerable:
        num_vulnerabilities = random.randint(1, 3)
        for _ in range(num_vulnerabilities):
            vulnerabilities.append(generate_vulnerability(name, version))
    
    # Generate license
    license_name = random.choice(LICENSES)
    license_compliance = random.choice(["Compliant", "Review Needed", "Non-Compliant"])
    
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
        "name": name,
        "version": version,
        "latest_version": latest_version,
        "language": language,
        "license": license_name,
        "license_compliance": license_compliance,
        "package_manager": random.choice(PACKAGE_MANAGERS),
        "is_vulnerable": is_vulnerable,
        "is_outdated": is_outdated,
        "vulnerabilities": vulnerabilities,
        "security_score": round(random.uniform(0, 100), 1) if is_vulnerable else round(random.uniform(80, 100), 1),
        "usage": usage,
        "source": random.choice(["npm", "PyPI", "Maven Central", "NuGet", "crates.io", "Go Modules", "RubyGems", "Packagist", "Docker Hub"]),
        "last_updated": (datetime.now() - timedelta(days=random.randint(0, 180))).strftime("%Y-%m-%d")
    }

def generate_image_vulnerability(image_name, tag):
    """Generate a vulnerability for a container image"""
    severity = random.choice(["Critical", "High", "Medium", "Low"])
    
    # Generate a CVE ID
    year = random.randint(2020, 2023)
    cve_id = f"CVE-{year}-{random.randint(10000, 99999)}"
    
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
    
    # Generate component information
    component = random.choice([
        "openssl", "glibc", "libxml2", "curl", "openssh", "bash", "python", "nodejs", 
        "openjdk", "dotnet", "nginx", "apache", "mysql", "postgresql", "redis", "mongodb"
    ])
    component_version = f"{random.randint(0, 5)}.{random.randint(0, 20)}.{random.randint(0, 50)}"
    
    return {
        "id": cve_id,
        "title": f"{random.choice(VULNERABILITY_TYPES)} in {component}",
        "description": f"A {severity.lower()} severity {random.choice(VULNERABILITY_TYPES).lower()} vulnerability was found in {component} version {component_version} that allows attackers to {random.choice(['execute arbitrary code', 'access sensitive information', 'cause denial of service', 'bypass authentication', 'escalate privileges'])}.",
        "severity": severity,
        "cvss_score": cvss_score,
        "component": component,
        "component_version": component_version,
        "fixed_version": f"{component_version.split('.')[0]}.{component_version.split('.')[1]}.{int(component_version.split('.')[2]) + random.randint(1, 5)}",
        "layer_id": f"sha256:{random.randint(10000000, 99999999)}",
        "published_date": (datetime.now() - timedelta(days=random.randint(30, 365))).strftime("%Y-%m-%d"),
        "remediation": random.choice(REMEDIATION_ACTIONS),
        "exploit_available": random.choice([True, False])
    }

def generate_image(name=None, tag=None):
    """Generate a container image with vulnerabilities"""
    if not name:
        name = f"{random.choice(['nginx', 'node', 'python', 'java', 'dotnet', 'golang', 'ruby', 'php', 'alpine', 'ubuntu', 'debian', 'centos', 'fedora', 'amazonlinux'])}"
    
    if not tag:
        tag = f"{random.randint(1, 20)}.{random.randint(0, 20)}"
    
    # Determine if the image has vulnerabilities
    has_vulnerabilities = random.random() < 0.7  # 70% chance of having vulnerabilities
    
    # Generate vulnerabilities
    vulnerabilities = []
    if has_vulnerabilities:
        num_vulnerabilities = random.randint(1, 10)
        for _ in range(num_vulnerabilities):
            vulnerabilities.append(generate_image_vulnerability(name, tag))
    
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
    
    return {
        "name": name,
        "tag": tag,
        "full_name": f"{name}:{tag}",
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
        "used_by": random.sample(["frontend", "backend", "api", "auth", "database", "cache", "queue", "worker", "scheduler", "notification"], random.randint(1, 3))
    }

def generate_opensource_security_data():
    """Generate open source security data"""
    # Generate packages
    packages = []
    num_packages = random.randint(30, 50)
    for _ in range(num_packages):
        packages.append(generate_package())
    
    # Generate images
    images = []
    num_images = random.randint(10, 20)
    for _ in range(num_images):
        images.append(generate_image())
    
    # Calculate summary statistics
    total_packages = len(packages)
    vulnerable_packages = sum(1 for p in packages if p["is_vulnerable"])
    outdated_packages = sum(1 for p in packages if p["is_outdated"])
    
    total_images = len(images)
    vulnerable_images = sum(1 for i in images if i["vulnerability_counts"]["total"] > 0)
    
    # Count vulnerabilities by severity
    critical_vulnerabilities = sum(sum(1 for v in p["vulnerabilities"] if v["severity"] == "Critical") for p in packages)
    critical_vulnerabilities += sum(i["vulnerability_counts"]["critical"] for i in images)
    
    high_vulnerabilities = sum(sum(1 for v in p["vulnerabilities"] if v["severity"] == "High") for p in packages)
    high_vulnerabilities += sum(i["vulnerability_counts"]["high"] for i in images)
    
    medium_vulnerabilities = sum(sum(1 for v in p["vulnerabilities"] if v["severity"] == "Medium") for p in packages)
    medium_vulnerabilities += sum(i["vulnerability_counts"]["medium"] for i in images)
    
    low_vulnerabilities = sum(sum(1 for v in p["vulnerabilities"] if v["severity"] == "Low") for p in packages)
    low_vulnerabilities += sum(i["vulnerability_counts"]["low"] for i in images)
    
    total_vulnerabilities = critical_vulnerabilities + high_vulnerabilities + medium_vulnerabilities + low_vulnerabilities
    
    # Count vulnerabilities by type
    vulnerability_types = {}
    for p in packages:
        for v in p["vulnerabilities"]:
            v_type = v["title"].split(" in ")[0]
            if v_type in vulnerability_types:
                vulnerability_types[v_type] += 1
            else:
                vulnerability_types[v_type] = 1
    
    for i in images:
        for v in i["vulnerabilities"]:
            v_type = v["title"].split(" in ")[0]
            if v_type in vulnerability_types:
                vulnerability_types[v_type] += 1
            else:
                vulnerability_types[v_type] = 1
    
    # Count licenses
    license_distribution = {}
    for p in packages:
        if p["license"] in license_distribution:
            license_distribution[p["license"]] += 1
        else:
            license_distribution[p["license"]] = 1
    
    # Generate remediation progress
    remediation_progress = {
        "fixed": random.randint(0, total_vulnerabilities // 3),
        "in_progress": random.randint(0, total_vulnerabilities // 3),
        "not_started": 0
    }
    remediation_progress["not_started"] = total_vulnerabilities - remediation_progress["fixed"] - remediation_progress["in_progress"]
    
    return {
        "summary": {
            "total_packages": total_packages,
            "vulnerable_packages": vulnerable_packages,
            "outdated_packages": outdated_packages,
            "total_images": total_images,
            "vulnerable_images": vulnerable_images,
            "vulnerabilities": {
                "critical": critical_vulnerabilities,
                "high": high_vulnerabilities,
                "medium": medium_vulnerabilities,
                "low": low_vulnerabilities,
                "total": total_vulnerabilities
            },
            "vulnerability_types": vulnerability_types,
            "license_distribution": license_distribution,
            "remediation_progress": remediation_progress
        },
        "packages": packages,
        "images": images,
        "timestamp": datetime.now().isoformat()
    }

def main():
    """Main function to generate and save open source security data"""
    try:
        logger.info("Starting open source security data generation...")
        
        # Generate data
        logger.info("Generating vulnerability data...")
        data = generate_opensource_security_data()
        
        # Validate data
        if not data or 'packages' not in data or 'images' not in data:
            raise ValueError("Generated data is invalid or incomplete")
        
        logger.info(f"Generated {len(data['packages'])} packages and {len(data['images'])} images")
        
        # Save data using centralized config
        output_paths = get_all_output_paths('opensource_security')
        
        for path in output_paths:
            try:
                os.makedirs(os.path.dirname(path), exist_ok=True)
                
                with open(path, 'w') as f:
                    json.dump(data, f, indent=2)
                
                logger.info(f"Data saved to: {path}")
            except IOError as e:
                logger.error(f"Failed to write to {path}: {e}")
                raise
        
        logger.info("Open source security data generation complete.")
        return 0
        
    except ValueError as e:
        logger.error(f"Data validation error: {e}")
        return 1
    except IOError as e:
        logger.error(f"File I/O error: {e}")
        return 1
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        return 1

if __name__ == "__main__":
    sys.exit(main())
