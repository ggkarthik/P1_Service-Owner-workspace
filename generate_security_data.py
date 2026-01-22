import json
import random
import os
import uuid
import hashlib
from datetime import datetime, timedelta

def generate_commit_sha(seed_data):
    """Generate a deterministic commit SHA based on seed data"""
    timestamp = int(datetime.now().timestamp())
    seed = f"{seed_data}{timestamp}".encode('utf-8')
    return hashlib.sha1(seed).hexdigest()

def get_file_commit_sha(file_path, repo_root):
    """Generate a deterministic commit SHA for a file"""
    # In a real implementation, this would query git for the file's commit SHA
    # For now, we'll generate a deterministic hash based on the file path and content
    try:
        with open(os.path.join(repo_root, file_path), 'rb') as f:
            content = f.read()
        return hashlib.sha1(f"file:{file_path}:{content}".encode('utf-8')).hexdigest()
    except:
        return hashlib.sha1(f"file:{file_path}".encode('utf-8')).hexdigest()

def get_image_commit_sha(image_name, file_sha):
    """Generate a deterministic commit SHA for an image based on its build files"""
    return hashlib.sha1(f"image:{image_name}:{file_sha}".encode('utf-8')).hexdigest()

# Sample vulnerable packages and their versions
vulnerable_packages = [
    {'name': 'log4j', 'version': '2.14.1', 'fixed_version': '2.15.0'},
    {'name': 'spring-core', 'version': '5.3.13', 'fixed_version': '5.3.14'},
    {'name': 'jackson-databind', 'version': '2.12.3', 'fixed_version': '2.12.6.1'},
    {'name': 'commons-text', 'version': '1.9', 'fixed_version': '1.10.0'},
    {'name': 'golang.org/x/crypto', 'version': 'v0.0.1', 'fixed_version': 'v0.0.2'},
    {'name': 'github.com/gorilla/websocket', 'version': 'v1.4.0', 'fixed_version': 'v1.4.2'},
    {'name': '@angular/core', 'version': '12.0.0', 'fixed_version': '12.0.1'},
    {'name': 'react-dom', 'version': '16.0.0', 'fixed_version': '16.0.1'},
]

# Define microservices with their key files and images
microservices = [
    {
        "name": "frontend",
        "files": ["main.go", "handlers.go", "router.go", "templates/home.html", "static/styles.css"],
        "image": "frontend:v1.0.0",
        "language": "Go"
    },
    {
        "name": "cartservice",
        "files": ["Program.cs", "CartService.cs", "Startup.cs", "Models/Cart.cs"],
        "image": "cartservice:v1.0.0",
        "language": "C#"
    },
    {
        "name": "productcatalogservice",
        "files": ["server.go", "products.go", "data/products.json"],
        "image": "productcatalogservice:v1.0.0",
        "language": "Go"
    },
    {
        "name": "currencyservice",
        "files": ["server.js", "currency_converter.js", "data/currency_data.json"],
        "image": "currencyservice:v1.0.0",
        "language": "Node.js"
    },
    {
        "name": "paymentservice",
        "files": ["index.js", "charge.js", "payment_methods.js"],
        "image": "paymentservice:v1.0.0",
        "language": "Node.js"
    },
    {
        "name": "shippingservice",
        "files": ["main.go", "shipping.go", "quote.go", "tracking.go"],
        "image": "shippingservice:v1.0.0",
        "language": "Go"
    },
    {
        "name": "emailservice",
        "files": ["email_server.py", "templates.py", "sender.py"],
        "image": "emailservice:v1.0.0",
        "language": "Python"
    },
    {
        "name": "checkoutservice",
        "files": ["main.go", "checkout.go", "money.go", "order.go"],
        "image": "checkoutservice:v1.0.0",
        "language": "Go"
    },
    {
        "name": "recommendationservice",
        "files": ["recommendation_server.py", "model.py", "product_catalog.py"],
        "image": "recommendationservice:v1.0.0",
        "language": "Python"
    },
    {
        "name": "adservice",
        "files": ["AdService.java", "AdServiceClient.java", "AdCatalog.java"],
        "image": "adservice:v1.0.0",
        "language": "Java"
    },
    {
        "name": "loadgenerator",
        "files": ["locustfile.py", "generator.py", "requirements.txt"],
        "image": "loadgenerator:v1.0.0",
        "language": "Python"
    },
    {
        "name": "shoppingassistantservice",
        "files": ["assistant.py", "recommendation_engine.py", "user_profiles.py"],
        "image": "shoppingassistantservice:v1.0.0",
        "language": "Python"
    }
]

# Define security finding details
finding_types = {
    "code": ["SAST", "SCA", "Secrets"],
    "build": ["Image Scan"],
    "runtime": ["Misconfiguration", "Runtime Findings"]
}

severities = ["Critical", "High", "Medium", "Low", "Informational"]
sources = {
    "SAST": "CodeQL",
    "SCA": "Dependabot",
    "Secrets": "TruffleHog",
    "Image Scan": "Trivy",
    "Misconfiguration": "Kube-bench",
    "Runtime Findings": "Falco"
}

owners = ["Team A", "Team B", "Team C", "Security Team"]

security_data = []

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

# Generate connected findings across the pipeline
security_data = []

for service_info in microservices:
    service_name = service_info['name']
    files = service_info['files']
    image_name = service_info['image']
    
    # Generate a SHA ID for each image (simulating a Docker image SHA)
    image_sha = hashlib.sha256(f'{image_name}-{random.randint(1000, 9999)}'.encode()).hexdigest()[:64]
    
    # Create 1-3 chains of connected findings (code -> build -> runtime)
    connected_chains = random.randint(1, 3)
    
    service_findings = {
        'microservice': service_name,
        'language': service_info['language'],
        'image': image_name,
        'image_sha': image_sha,
        'findings': [],
        'connected_findings': []
    }
    
    # Generate connected finding chains
    for _ in range(connected_chains):
        # Select a file that will be the basis for the chain
        affected_file = random.choice(files)
        
        # Get the commit SHA for the affected file
        # In a real implementation, this would come from git history
        file_commit_sha = get_file_commit_sha(affected_file, ".")
        
        # Generate a deterministic commit SHA for this chain of artifacts
        # This creates a traceable link from code to deployment
        chain_id = generate_commit_sha(f"{service_name}:{affected_file}")
        
        # Update the image SHA to be derived from the file's commit SHA
        image_sha = get_image_commit_sha(image_name, file_commit_sha)
        
        # Select a vulnerable package for this chain
        vulnerable_package = random.choice(vulnerable_packages)
        
        # Code stage finding - linked to file name
        code_finding_type = random.choice(['SAST', 'SCA', 'Secrets'])
        code_finding = {
            'id': f'{code_finding_type.lower()}-{service_name}-{chain_id}',
            'chain_id': chain_id,
            'stage': 'code',
            'type': code_finding_type,
            'description': random.choice(vulnerability_types[code_finding_type]),
            'severity': random.choice(['Critical', 'High', 'Medium', 'Low']),
            'source': sources[code_finding_type],
            'owner': random.choice(owners),
            'file': affected_file,  # Link to file name
            'file_commit_sha': file_commit_sha,  # Link to file's commit SHA
            'line': random.randint(10, 500),
            'commit_sha': chain_id,  # The commit SHA this finding is associated with
            'connected_to': [],
            'vulnerable_package': {
                'name': vulnerable_package['name'],
                'version': vulnerable_package['version'],
                'fixed_version': vulnerable_package['fixed_version']
            }
        }
        
        # Build stage finding - linked to image SHA
        build_finding = {
            'id': f'image-{service_name}-{chain_id}',
            'chain_id': chain_id,
            'stage': 'build',
            'type': 'Image Scan',
            'description': random.choice(vulnerability_types['Image Scan']),
            'severity': random.choice(['Critical', 'High', 'Medium', 'Low']),
            'source': sources['Image Scan'],
            'owner': random.choice(owners),
            'image': image_name,
            'image_sha': image_sha,  # Link to image SHA
            'commit_sha': chain_id,  # The commit SHA this finding is associated with
            'connected_to': [code_finding['id']],
            'build_commit_sha': chain_id,  # The commit SHA that triggered this build
            'vulnerable_package': code_finding['vulnerable_package']  # Link to the same vulnerable package
        }
        code_finding['connected_to'].append(build_finding['id'])
        
        # Runtime stage finding (50% chance) - linked to image SHA, not pod
        runtime_finding = None
        if random.choice([True, False]):
            runtime_type = random.choice(['Misconfiguration', 'Runtime Findings'])
            runtime_finding = {
                'id': f'{runtime_type.lower()}-{service_name}-{chain_id}',
                'chain_id': chain_id,
                'stage': 'runtime',
                'type': runtime_type,
                'description': random.choice(vulnerability_types[runtime_type]),
                'severity': random.choice(['Critical', 'High', 'Medium', 'Low']),
                'source': sources[runtime_type],
                'owner': random.choice(owners),
                'image': image_name,
                'image_sha': image_sha,  # Link to image SHA
                'commit_sha': chain_id,  # The commit SHA this finding is associated with
                'pod_name': f'{service_name}-pod-{random.randint(1000, 9999)}',  # Still include pod name for reference
                'deployment_commit_sha': chain_id,  # The commit SHA that triggered this deployment
                'connected_to': [build_finding['id']],
                'vulnerable_package': code_finding['vulnerable_package']  # Link to the same vulnerable package
            }
            build_finding['connected_to'].append(runtime_finding['id'])
            service_findings['findings'].append(runtime_finding)
        
        service_findings['findings'].append(code_finding)
        service_findings['findings'].append(build_finding)
        
        # Add this chain to connected_findings with pipeline view information
        # Store the commit SHA for this chain
        chain_commit_sha = generate_commit_sha(f"{service_name}:{affected_file}:{image_sha}")

        # Pipeline metadata
        pipeline_metadata = {
            'start_time': (datetime.now() - timedelta(hours=random.randint(1, 24))).isoformat(),
            'end_time': datetime.now().isoformat(),
            'triggered_by': random.choice(['push', 'pull_request', 'schedule']),
            'source_branch': 'main',
            'target_branch': 'main'
        }

        # Pipeline stages with detailed information
        pipeline_stages = [
            {
                'id': 'code',
                'name': 'Unknown Source',
                'type': 'code',
                'status': 'completed',
                'details': {
                    'file': affected_file,
                    'commit_sha': chain_commit_sha,
                    'findings': [code_finding['id']]
                }
            },
            {
                'id': 'store',
                'name': f'gke.gcr.io/gcp-com/{service_name}',
                'type': 'container_repository',
                'status': 'completed',
                'details': {
                    'image': image_name,
                    'sha': image_sha,
                    'findings': [build_finding['id']]
                }
            },
            {
                'id': 'cloud',
                'name': f'gke.gcr.io/gcp-com/{service_name}',
                'type': 'container_image',
                'status': 'active',
                'details': {
                    'image': image_name,
                    'sha': image_sha,
                    'findings': [runtime_finding['id']] if runtime_finding else []
                }
            }
        ]

        connected_chain = {
            'chain_id': chain_id,
            'commit_sha': chain_id,
            'name': 'Code to Cloud Pipeline',
            'status': 'active',
            'stages': pipeline_stages,
            'findings': [code_finding['id'], build_finding['id']] + ([runtime_finding['id']] if runtime_finding else []),
            'metadata': pipeline_metadata
        }
        service_findings['connected_findings'].append(connected_chain)
    
    # Add some standalone findings too (not connected across stages)
    standalone_count = random.randint(2, 5)
    for i in range(standalone_count):
        stage = random.choice(['code', 'build', 'runtime'])
        
        # Generate a unique commit SHA for standalone findings
        standalone_commit_sha = generate_commit_sha(f"standalone-{service_name}-{i}-{stage}")
        
        if stage == 'code':
            f_type = random.choice(['SAST', 'SCA', 'Secrets'])
            finding = {
                'id': f'{f_type.lower()}-{service_name}-standalone-{i}',
                'stage': stage,
                'type': f_type,
                'description': random.choice(vulnerability_types[f_type]),
                'severity': random.choice(severities),
                'source': sources[f_type],
                'owner': random.choice(owners),
                'file': random.choice(files),  # Link to file name
                'file_commit_sha': generate_commit_sha(f"file-{random.choice(files)}"),
                'line': random.randint(10, 500),
                'commit_sha': standalone_commit_sha,  # The commit SHA this finding is associated with
                'connected_to': []
            }
        elif stage == 'build':
            # Generate a unique SHA for standalone build findings
            standalone_sha = hashlib.sha256(f'{image_name}-standalone-{i}'.encode()).hexdigest()[:64]
            finding = {
                'id': f'image-{service_name}-standalone-{i}',
                'stage': stage,
                'type': 'Image Scan',
                'description': random.choice(vulnerability_types['Image Scan']),
                'severity': random.choice(severities),
                'source': sources['Image Scan'],
                'owner': random.choice(owners),
                'image': image_name,
                'image_sha': standalone_sha,  # Link to image SHA
                'commit_sha': standalone_commit_sha,  # The commit SHA this finding is associated with
                'build_commit_sha': standalone_commit_sha,  # The commit SHA that triggered this build
                'connected_to': []
            }
        else:  # runtime
            f_type = random.choice(['Misconfiguration', 'Runtime Findings'])
            # Runtime findings use the same SHA as the image
            finding = {
                'id': f'{f_type.lower()}-{service_name}-standalone-{i}',
                'stage': stage,
                'type': f_type,
                'description': random.choice(vulnerability_types[f_type]),
                'severity': random.choice(severities),
                'source': sources[f_type],
                'owner': random.choice(owners),
                'image': image_name,
                'image_sha': image_sha,  # Link to image SHA
                'commit_sha': standalone_commit_sha,  # The commit SHA this finding is associated with
                'pod_name': f'{service_name}-pod-{random.randint(1000, 9999)}',  # For reference only
                'deployment_commit_sha': standalone_commit_sha,  # The commit SHA that triggered this deployment
                'connected_to': []
            }
        service_findings['findings'].append(finding)

    security_data.append(service_findings)

# Define the output path and ensure the directory exists
output_path = "react-dashboard/public/data/security_findings.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)

# Write to a JSON file
with open(output_path, "w") as f:
    json.dump(security_data, f, indent=4)

print("Generated security_findings.json with pipeline view")
print("- Each chain includes a Code to Cloud pipeline view")
print("- Pipeline stages: Code -> Store -> Cloud")
print("- Each stage includes relevant findings and artifacts")
print("- All artifacts are linked by commit SHAs")
