#!/usr/bin/env python3
"""
Security Data Generator for Microservices Dashboard

This script generates security findings data for the microservices dashboard.
It reads the existing inventory data and adds security findings.
"""

import os
import json
import random
import uuid
from datetime import datetime, timedelta

# Output directories
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
REACT_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "react-dashboard/src/data")
PUBLIC_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "react-dashboard/public/data")

# Ensure output directories exist
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(REACT_DATA_DIR, exist_ok=True)
os.makedirs(PUBLIC_DATA_DIR, exist_ok=True)

# Define vulnerability types with their descriptions
vulnerability_types = {
    "SAST": [
        "SQL Injection vulnerability",
        "Cross-Site Scripting (XSS) detected",
        "Path Traversal vulnerability",
        "Insecure Deserialization",
        "Command Injection risk"
    ],
    "SCA": [
        "Outdated library with known vulnerabilities",
        "Vulnerable dependency found",
        "Critical update required for package",
        "Library with unsupported version used",
        "Security patch missing in dependency"
    ],
    "Secrets": [
        "Hardcoded API key detected",
        "Potential password in code",
        "Authentication credentials found",
        "Encryption key in source code",
        "Token or secret leaked in code"
    ],
    "Image Scan": [
        "OS vulnerability in base image",
        "Outdated package in container",
        "Malware signature detected",
        "Insecure configuration in image",
        "Unnecessary package increasing attack surface"
    ],
    "Misconfiguration": [
        "Excessive permissions in deployment",
        "Privileged container execution",
        "Missing network policy",
        "Insecure port exposed",
        "Resource quota not defined"
    ],
    "Runtime Findings": [
        "Unusual process execution detected",
        "Unexpected network connection",
        "File system modification alert",
        "Privilege escalation attempt",
        "Container escape attempt"
    ]
}

# Sources for different finding types
sources = {
    "SAST": "CodeQL",
    "SCA": "Dependabot",
    "Secrets": "TruffleHog",
    "Image Scan": "Trivy",
    "Misconfiguration": "Kube-bench",
    "Runtime Findings": "Falco"
}

# Team owners
owners = ["Security Team", "DevOps Team", "Development Team", "Platform Team"]

# Severity levels
severities = ["Critical", "High", "Medium", "Low"]

def generate_security_data(inventory_data):
    """
    Generate security findings data based on inventory data.
    """
    security_data = {
        "summary": {
            "total_findings": 0,
            "critical": 0,
            "high": 0,
            "medium": 0,
            "low": 0,
            "by_type": {},
            "by_service": {},
            "by_stage": {
                "code": 0,
                "build": 0,
                "runtime": 0
            }
        },
        "services": [],
        "timestamp": datetime.now().isoformat()
    }
    
    # Process each service in the inventory
    for service in inventory_data.get("services", {}).get("services", []):
        service_name = service.get("name")
        language = service.get("language")
        
        service_findings = {
            "name": service_name,
            "language": language,
            "findings_count": 0,
            "findings": [],
            "connected_findings": []
        }
        
        # Generate 1-3 chains of connected findings
        chains_count = random.randint(1, 3)
        for j in range(chains_count):
            chain_id = str(uuid.uuid4())[:8]
            
            # Affected file (randomly select or generate)
            affected_file = f"{service_name}/{service_name}_main.{get_file_extension(language)}"
            
            # Image name
            image_name = f"gcr.io/google-samples/microservices-demo/{service_name}:latest"
            
            # Code stage finding
            code_type = random.choice(["SAST", "SCA", "Secrets"])
            code_finding = {
                "id": f"{code_type.lower()}-{service_name}-{chain_id}",
                "chain_id": chain_id,
                "stage": "code",
                "type": code_type,
                "description": random.choice(vulnerability_types[code_type]),
                "severity": random.choice(severities),
                "source": sources[code_type],
                "owner": random.choice(owners),
                "file": affected_file,
                "line": random.randint(10, 500),
                "connected_to": []
            }
            
            # Build stage finding
            build_type = random.choice(["SCA", "Image Scan"])
            build_finding = {
                "id": f"{build_type.lower()}-{service_name}-{chain_id}",
                "chain_id": chain_id,
                "stage": "build",
                "type": build_type,
                "description": random.choice(vulnerability_types[build_type]),
                "severity": random.choice(severities),
                "source": sources[build_type],
                "owner": random.choice(owners),
                "image": image_name,
                "connected_to": [code_finding["id"]]
            }
            code_finding["connected_to"].append(build_finding["id"])
            
            # Runtime stage finding (50% chance)
            runtime_finding = None
            if random.choice([True, False]):
                runtime_type = random.choice(["Misconfiguration", "Runtime Findings"])
                runtime_finding = {
                    "id": f"{runtime_type.lower()}-{service_name}-{chain_id}",
                    "chain_id": chain_id,
                    "stage": "runtime",
                    "type": runtime_type,
                    "description": random.choice(vulnerability_types[runtime_type]),
                    "severity": random.choice(["Critical", "High", "Medium", "Low"]),
                    "source": sources[runtime_type],
                    "owner": random.choice(owners),
                    "pod_name": f"{service_name}-pod-{random.randint(1000, 9999)}",
                    "connected_to": [build_finding["id"]]
                }
                build_finding["connected_to"].append(runtime_finding["id"])
                service_findings["findings"].append(runtime_finding)
            
            service_findings["findings"].append(code_finding)
            service_findings["findings"].append(build_finding)
            
            # Add this chain to connected_findings
            service_findings["connected_findings"].append({
                "chain_id": chain_id,
                "file": affected_file,
                "image": image_name,
                "findings": [code_finding["id"], build_finding["id"]] + 
                           ([runtime_finding["id"]] if runtime_finding else [])
            })
        
        # Add some standalone findings too (not connected across stages)
        standalone_count = random.randint(2, 5)
        for i in range(standalone_count):
            stage = random.choice(["code", "build", "runtime"])
            if stage == "code":
                f_type = random.choice(["SAST", "SCA", "Secrets"])
                finding = {
                    "id": f"{f_type.lower()}-{service_name}-standalone-{i}",
                    "stage": stage,
                    "type": f_type,
                    "description": random.choice(vulnerability_types[f_type]),
                    "severity": random.choice(severities),
                    "source": sources[f_type],
                    "owner": random.choice(owners),
                    "file": f"{service_name}/{random.choice(['utils', 'helpers', 'models', 'controllers'])}.{get_file_extension(language)}",
                    "line": random.randint(10, 500),
                    "connected_to": []
                }
            elif stage == "build":
                f_type = random.choice(["SCA", "Image Scan"])
                finding = {
                    "id": f"{f_type.lower()}-{service_name}-standalone-{i}",
                    "stage": stage,
                    "type": f_type,
                    "description": random.choice(vulnerability_types[f_type]),
                    "severity": random.choice(severities),
                    "source": sources[f_type],
                    "owner": random.choice(owners),
                    "image": f"gcr.io/google-samples/microservices-demo/{service_name}:latest",
                    "connected_to": []
                }
            else:  # runtime
                f_type = random.choice(["Misconfiguration", "Runtime Findings"])
                finding = {
                    "id": f"{f_type.lower()}-{service_name}-standalone-{i}",
                    "stage": stage,
                    "type": f_type,
                    "description": random.choice(vulnerability_types[f_type]),
                    "severity": random.choice(severities),
                    "source": sources[f_type],
                    "owner": random.choice(owners),
                    "pod_name": f"{service_name}-pod-{random.randint(1000, 9999)}",
                    "connected_to": []
                }
            
            service_findings["findings"].append(finding)
        
        # Update findings count
        service_findings["findings_count"] = len(service_findings["findings"])
        
        # Add to security data
        security_data["services"].append(service_findings)
    
    # Calculate summary statistics
    for service in security_data["services"]:
        service_name = service["name"]
        security_data["summary"]["by_service"][service_name] = service["findings_count"]
        security_data["summary"]["total_findings"] += service["findings_count"]
        
        for finding in service["findings"]:
            severity = finding["severity"]
            finding_type = finding["type"]
            stage = finding["stage"]
            
            security_data["summary"][severity.lower()] += 1
            security_data["summary"]["by_stage"][stage] += 1
            
            if finding_type not in security_data["summary"]["by_type"]:
                security_data["summary"]["by_type"][finding_type] = 0
            security_data["summary"]["by_type"][finding_type] += 1
    
    return security_data

def get_file_extension(language):
    """
    Get file extension based on programming language.
    """
    extensions = {
        "Go": "go",
        "Java": "java",
        "C#": "cs",
        "Python": "py",
        "Node.js": "js",
        "JavaScript": "js",
        "TypeScript": "ts"
    }
    return extensions.get(language, "txt")

def main():
    """
    Main function to read inventory data and generate security findings.
    """
    # Read inventory data
    inventory_file = os.path.join(OUTPUT_DIR, "microservices_inventory.json")
    
    try:
        with open(inventory_file, 'r') as f:
            inventory_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: Inventory file not found at {inventory_file}")
        return
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in inventory file {inventory_file}")
        return
    
    # Generate security data
    security_data = generate_security_data(inventory_data)
    
    # Save security data
    security_output_paths = [
        os.path.join(OUTPUT_DIR, "security_findings.json"),
        os.path.join(REACT_DATA_DIR, "security_findings.json"),
        os.path.join(PUBLIC_DATA_DIR, "security_findings.json")
    ]
    
    for path in security_output_paths:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        with open(path, 'w') as f:
            json.dump(security_data, f, indent=2)
        
        print(f"Security data saved to: {path}")
    
    print("Security data generation complete.")

if __name__ == "__main__":
    main()
