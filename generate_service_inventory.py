#!/usr/bin/env python3
"""
Service Inventory Analyzer for Microservices Dashboard

This script analyzes the microservices-demo-app repository to extract detailed
inventory information about each microservice, including:
- Language and framework details
- Dependencies and libraries
- API endpoints and communication patterns
- Infrastructure and deployment configuration
- Resource requirements and limits
- Security configurations and best practices
"""

import os
import json
import re
import yaml
import subprocess
from pathlib import Path
from datetime import datetime

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MICROSERVICES_REPO = os.path.join(os.path.dirname(SCRIPT_DIR), "microservices-demo-app")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "data/generated")
PUBLIC_DATA_DIR = os.path.join(SCRIPT_DIR, "react-dashboard/public/data")

# Ensure output directories exist
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(PUBLIC_DATA_DIR, exist_ok=True)

# Service definitions with known languages and paths
SERVICES = [
    {
        "name": "frontend",
        "language": "Go",
        "path": "src/frontend",
        "description": "Exposes an HTTP server to serve the website"
    },
    {
        "name": "cartservice",
        "language": "C#",
        "path": "src/cartservice",
        "description": "Stores shopping cart items in Redis"
    },
    {
        "name": "productcatalogservice",
        "language": "Go",
        "path": "src/productcatalogservice",
        "description": "Provides product listings and search"
    },
    {
        "name": "currencyservice",
        "language": "Node.js",
        "path": "src/currencyservice",
        "description": "Converts money amounts between currencies"
    },
    {
        "name": "paymentservice",
        "language": "Node.js",
        "path": "src/paymentservice",
        "description": "Processes payments (mock)"
    },
    {
        "name": "shippingservice",
        "language": "Go",
        "path": "src/shippingservice",
        "description": "Calculates shipping costs and handles shipping (mock)"
    },
    {
        "name": "emailservice",
        "language": "Python",
        "path": "src/emailservice",
        "description": "Sends order confirmation emails (mock)"
    },
    {
        "name": "checkoutservice",
        "language": "Go",
        "path": "src/checkoutservice",
        "description": "Orchestrates the checkout process"
    },
    {
        "name": "recommendationservice",
        "language": "Python",
        "path": "src/recommendationservice",
        "description": "Recommends related products"
    },
    {
        "name": "adservice",
        "language": "Java",
        "path": "src/adservice",
        "description": "Provides text ads based on context"
    },
    {
        "name": "loadgenerator",
        "language": "Python",
        "path": "src/loadgenerator",
        "description": "Simulates user traffic"
    },
    {
        "name": "shoppingassistantservice",
        "language": "Python",
        "path": "src/shoppingassistantservice",
        "description": "AI assistant for product suggestions"
    }
]

# Function to extract dependencies based on language
def extract_dependencies(service):
    """Extract dependencies for a service based on its language"""
    service_path = os.path.join(MICROSERVICES_REPO, service["path"])
    dependencies = []
    
    if not os.path.exists(service_path):
        return dependencies
    
    if service["language"] == "Go":
        # Extract Go dependencies from go.mod
        go_mod_path = os.path.join(service_path, "go.mod")
        if os.path.exists(go_mod_path):
            with open(go_mod_path, 'r') as f:
                content = f.read()
                # Extract require blocks
                require_block = re.search(r'require\s*\((.*?)\)', content, re.DOTALL)
                if require_block:
                    for line in require_block.group(1).strip().split('\n'):
                        line = line.strip()
                        if line and not line.startswith('//'):
                            parts = line.split()
                            if len(parts) >= 1:
                                dependencies.append({
                                    "name": parts[0],
                                    "version": parts[1] if len(parts) > 1 else "latest",
                                    "type": "direct"
                                })
                
                # Extract indirect dependencies
                indirect_deps = re.findall(r'([^\s]+)\s+([^\s]+)\s+//\s+indirect', content)
                for dep, version in indirect_deps:
                    dependencies.append({
                        "name": dep,
                        "version": version,
                        "type": "indirect"
                    })
    
    elif service["language"] == "Node.js":
        # Extract Node.js dependencies from package.json
        package_json_path = os.path.join(service_path, "package.json")
        if os.path.exists(package_json_path):
            with open(package_json_path, 'r') as f:
                try:
                    package_data = json.load(f)
                    if "dependencies" in package_data:
                        for name, version in package_data["dependencies"].items():
                            dependencies.append({
                                "name": name,
                                "version": version.replace('^', '').replace('~', ''),
                                "type": "production"
                            })
                    if "devDependencies" in package_data:
                        for name, version in package_data["devDependencies"].items():
                            dependencies.append({
                                "name": name,
                                "version": version.replace('^', '').replace('~', ''),
                                "type": "development"
                            })
                except json.JSONDecodeError:
                    pass
    
    elif service["language"] == "Python":
        # Extract Python dependencies from requirements.txt
        requirements_path = os.path.join(service_path, "requirements.txt")
        if os.path.exists(requirements_path):
            with open(requirements_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        # Handle different requirement formats
                        if '==' in line:
                            name, version = line.split('==', 1)
                            dependencies.append({
                                "name": name.strip(),
                                "version": version.strip(),
                                "type": "production"
                            })
                        elif '>=' in line:
                            name, version = line.split('>=', 1)
                            dependencies.append({
                                "name": name.strip(),
                                "version": f">={version.strip()}",
                                "type": "production"
                            })
                        else:
                            dependencies.append({
                                "name": line,
                                "version": "latest",
                                "type": "production"
                            })
    
    elif service["language"] == "C#":
        # Extract C# dependencies from .csproj files
        for root, _, files in os.walk(service_path):
            for file in files:
                if file.endswith('.csproj'):
                    csproj_path = os.path.join(root, file)
                    with open(csproj_path, 'r') as f:
                        content = f.read()
                        package_refs = re.findall(r'<PackageReference\s+Include="([^"]+)"\s+Version="([^"]+)"', content)
                        for name, version in package_refs:
                            dependencies.append({
                                "name": name,
                                "version": version,
                                "type": "production"
                            })
    
    elif service["language"] == "Java":
        # Extract Java dependencies from build.gradle or pom.xml
        build_gradle_path = os.path.join(service_path, "build.gradle")
        pom_xml_path = os.path.join(service_path, "pom.xml")
        
        if os.path.exists(build_gradle_path):
            with open(build_gradle_path, 'r') as f:
                content = f.read()
                # Simple regex for dependencies in build.gradle
                deps = re.findall(r'implementation\s+[\'"]([^:]+):([^:]+):([^\'"]+)[\'"]', content)
                for group, name, version in deps:
                    dependencies.append({
                        "name": f"{group}:{name}",
                        "version": version,
                        "type": "production"
                    })
        
        elif os.path.exists(pom_xml_path):
            with open(pom_xml_path, 'r') as f:
                content = f.read()
                # Simple regex for dependencies in pom.xml
                deps = re.findall(r'<dependency>\s*<groupId>([^<]+)</groupId>\s*<artifactId>([^<]+)</artifactId>\s*<version>([^<]+)</version>', content, re.DOTALL)
                for group, artifact, version in deps:
                    dependencies.append({
                        "name": f"{group}:{artifact}",
                        "version": version,
                        "type": "production"
                    })
    
    return dependencies

# Function to extract infrastructure details from Kubernetes manifests
def extract_infrastructure(service):
    """Extract infrastructure details from Kubernetes manifests"""
    service_name = service["name"]
    k8s_manifest_path = os.path.join(MICROSERVICES_REPO, f"kubernetes-manifests/{service_name}.yaml")
    
    infrastructure = {
        "deployment": {
            "type": "Kubernetes",
            "replicas": 1,
            "strategy": "RollingUpdate",
            "containers": []
        },
        "service": {
            "type": "ClusterIP",
            "ports": []
        },
        "resources": {
            "requests": {
                "cpu": "100m",
                "memory": "64Mi"
            },
            "limits": {
                "cpu": "200m",
                "memory": "128Mi"
            }
        },
        "security": {
            "securityContext": {},
            "serviceAccount": service_name
        },
        "config": {
            "env": [],
            "volumes": []
        },
        "network": {
            "ingress": False,
            "egress": [],
            "ports": []
        }
    }
    
    # Try to load from Kubernetes manifest
    if os.path.exists(k8s_manifest_path):
        try:
            with open(k8s_manifest_path, 'r') as f:
                manifests = list(yaml.safe_load_all(f))
                
                for manifest in manifests:
                    kind = manifest.get('kind', '')
                    
                    # Extract deployment details
                    if kind == 'Deployment':
                        spec = manifest.get('spec', {})
                        infrastructure['deployment']['replicas'] = spec.get('replicas', 1)
                        
                        # Extract container details
                        template_spec = spec.get('template', {}).get('spec', {})
                        containers = template_spec.get('containers', [])
                        
                        for container in containers:
                            container_info = {
                                "name": container.get('name', 'main'),
                                "image": container.get('image', service_name),
                                "ports": []
                            }
                            
                            # Extract ports
                            for port in container.get('ports', []):
                                container_info['ports'].append({
                                    "containerPort": port.get('containerPort', 0),
                                    "name": port.get('name', 'http')
                                })
                                infrastructure['network']['ports'].append(port.get('containerPort', 0))
                            
                            # Extract resources
                            if 'resources' in container:
                                resources = container['resources']
                                if 'requests' in resources:
                                    infrastructure['resources']['requests']['cpu'] = resources['requests'].get('cpu', '100m')
                                    infrastructure['resources']['requests']['memory'] = resources['requests'].get('memory', '64Mi')
                                if 'limits' in resources:
                                    infrastructure['resources']['limits']['cpu'] = resources['limits'].get('cpu', '200m')
                                    infrastructure['resources']['limits']['memory'] = resources['limits'].get('memory', '128Mi')
                            
                            # Extract environment variables
                            for env in container.get('env', []):
                                if 'name' in env and 'value' in env:
                                    infrastructure['config']['env'].append({
                                        "name": env['name'],
                                        "value": env['value']
                                    })
                            
                            infrastructure['deployment']['containers'].append(container_info)
                        
                        # Extract security context
                        if 'securityContext' in template_spec:
                            infrastructure['security']['securityContext'] = template_spec['securityContext']
                        
                        # Extract service account
                        if 'serviceAccountName' in template_spec:
                            infrastructure['security']['serviceAccount'] = template_spec['serviceAccountName']
                    
                    # Extract service details
                    elif kind == 'Service':
                        spec = manifest.get('spec', {})
                        infrastructure['service']['type'] = spec.get('type', 'ClusterIP')
                        
                        # Extract service ports
                        for port in spec.get('ports', []):
                            infrastructure['service']['ports'].append({
                                "port": port.get('port', 0),
                                "targetPort": port.get('targetPort', 0),
                                "name": port.get('name', 'http')
                            })
        except Exception as e:
            print(f"Error parsing Kubernetes manifest for {service_name}: {e}")
    
    return infrastructure


# Function to extract API endpoints and communication patterns
def extract_api_endpoints(service):
    """Extract API endpoints and communication patterns"""
    service_name = service["name"]
    service_path = os.path.join(MICROSERVICES_REPO, service["path"])
    
    api_info = {
        "protocol": "gRPC",  # Default for most services
        "endpoints": [],
        "client_connections": [],
        "server_endpoints": []
    }
    
    # Check for proto files to identify gRPC endpoints
    proto_files = []
    for root, _, files in os.walk(service_path):
        for file in files:
            if file.endswith('.proto'):
                proto_files.append(os.path.join(root, file))
    
    # If no proto files in service directory, check the main protos directory
    if not proto_files:
        protos_dir = os.path.join(MICROSERVICES_REPO, "protos")
        if os.path.exists(protos_dir):
            for root, _, files in os.walk(protos_dir):
                for file in files:
                    if file.endswith('.proto'):
                        proto_files.append(os.path.join(root, file))
    
    # Extract service definitions from proto files
    for proto_file in proto_files:
        try:
            with open(proto_file, 'r') as f:
                content = f.read()
                
                # Extract service definitions
                service_defs = re.findall(r'service\s+([^\s{]+)\s*{([^}]*)}', content, re.DOTALL)
                for service_name, service_content in service_defs:
                    # Extract RPC methods
                    rpc_methods = re.findall(r'rpc\s+([^\s(]+)\s*\(\s*([^)]+)\s*\)\s*returns\s*\(\s*([^)]+)\s*\)', service_content)
                    for method_name, request_type, response_type in rpc_methods:
                        api_info['server_endpoints'].append({
                            "name": method_name,
                            "request_type": request_type.strip(),
                            "response_type": response_type.strip(),
                            "service": service_name
                        })
        except Exception as e:
            print(f"Error parsing proto file {proto_file}: {e}")
    
    # Look for client connections in code files
    if service["language"] == "Go":
        # Check Go files for client connections
        for root, _, files in os.walk(service_path):
            for file in files:
                if file.endswith('.go'):
                    try:
                        with open(os.path.join(root, file), 'r') as f:
                            content = f.read()
                            # Look for gRPC client connections
                            connections = re.findall(r'grpc\.Dial\(\s*([^,]+)', content)
                            for conn in connections:
                                # Extract the service name from environment variables or constants
                                service_addr = conn.strip('"\'')
                                if '_SERVICE_ADDR' in service_addr:
                                    target_service = service_addr.split('_SERVICE_ADDR')[0].lower()
                                    api_info['client_connections'].append({
                                        "target_service": target_service,
                                        "protocol": "gRPC"
                                    })
                    except Exception as e:
                        print(f"Error parsing Go file: {e}")
    
    elif service["language"] == "Node.js":
        # Check JavaScript files for client connections
        for root, _, files in os.walk(service_path):
            for file in files:
                if file.endswith('.js'):
                    try:
                        with open(os.path.join(root, file), 'r') as f:
                            content = f.read()
                            # Look for gRPC client creation
                            connections = re.findall(r'new\s+([^(]+)Client\(\s*([^,)]+)', content)
                            for service_type, addr in connections:
                                api_info['client_connections'].append({
                                    "target_service": service_type.lower(),
                                    "protocol": "gRPC"
                                })
                    except Exception as e:
                        print(f"Error parsing JavaScript file: {e}")
    
    # Extract HTTP endpoints for frontend
    if service_name == "frontend":
        api_info["protocol"] = "HTTP/gRPC"
        # Look for HTTP route handlers
        for root, _, files in os.walk(service_path):
            for file in files:
                if file.endswith('.go') and file != 'main.go':
                    try:
                        with open(os.path.join(root, file), 'r') as f:
                            content = f.read()
                            # Look for HTTP handlers
                            handlers = re.findall(r'r\.(?:Handle|HandleFunc)\(\s*"([^"]+)"', content)
                            for handler in handlers:
                                api_info['endpoints'].append({
                                    "path": handler,
                                    "method": "GET",  # Assuming GET as default
                                    "protocol": "HTTP"
                                })
                    except Exception as e:
                        print(f"Error parsing Go file for HTTP endpoints: {e}")
    
    return api_info


# Function to extract code metrics
def extract_code_metrics(service):
    """Extract code metrics for a service"""
    service_path = os.path.join(MICROSERVICES_REPO, service["path"])
    
    metrics = {
        "loc": 0,  # Lines of code
        "files": 0,  # Number of files
        "directories": 0,  # Number of directories
        "file_types": {},  # Count of file types
        "complexity": "medium",  # Estimated complexity
        "test_coverage": 0.0,  # Estimated test coverage
        "documentation": "minimal"  # Documentation level
    }
    
    # Count files and directories
    for root, dirs, files in os.walk(service_path):
        metrics["directories"] += len(dirs)
        metrics["files"] += len(files)
        
        # Count lines of code and file types
        for file in files:
            file_path = os.path.join(root, file)
            
            # Get file extension
            _, ext = os.path.splitext(file)
            ext = ext.lower()
            if ext:
                metrics["file_types"][ext] = metrics["file_types"].get(ext, 0) + 1
            
            # Count lines of code for common source files
            if ext in ['.go', '.py', '.js', '.java', '.cs', '.ts', '.jsx', '.tsx']:
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        for line in f:
                            line = line.strip()
                            if line and not line.startswith(('//','#','/*','*','*/')):
                                metrics["loc"] += 1
                except Exception:
                    pass
    
    # Estimate test coverage
    test_files = 0
    for ext, count in metrics["file_types"].items():
        if 'test' in ext or ext == '.spec.js' or ext == '.test.js':
            test_files += count
    
    if metrics["files"] > 0:
        metrics["test_coverage"] = min(100.0, round(test_files / metrics["files"] * 100, 1))
    
    # Estimate complexity
    if metrics["loc"] < 500:
        metrics["complexity"] = "low"
    elif metrics["loc"] < 2000:
        metrics["complexity"] = "medium"
    else:
        metrics["complexity"] = "high"
    
    # Estimate documentation level
    doc_files = 0
    for root, _, files in os.walk(service_path):
        for file in files:
            if file.lower() in ['readme.md', 'docs', 'documentation', 'wiki']:
                doc_files += 1
    
    if doc_files == 0:
        metrics["documentation"] = "minimal"
    elif doc_files < 3:
        metrics["documentation"] = "moderate"
    else:
        metrics["documentation"] = "extensive"
    
    return metrics

# Function to extract deployment information
def extract_deployment_info(service):
    """Extract deployment information for a service"""
    service_name = service["name"]
    
    deployment_info = {
        "container_registry": "gcr.io/google-samples/microservices-demo",
        "image_tag": "latest",
        "deployment_strategy": "rolling-update",
        "health_checks": {
            "readiness": False,
            "liveness": False
        },
        "scaling": {
            "auto_scaling": False,
            "min_replicas": 1,
            "max_replicas": 1
        },
        "environment": "kubernetes"
    }
    
    # Check Kubernetes manifest for deployment info
    k8s_manifest_path = os.path.join(MICROSERVICES_REPO, f"kubernetes-manifests/{service_name}.yaml")
    if os.path.exists(k8s_manifest_path):
        try:
            with open(k8s_manifest_path, 'r') as f:
                manifests = list(yaml.safe_load_all(f))
                
                for manifest in manifests:
                    if manifest.get('kind') == 'Deployment':
                        spec = manifest.get('spec', {})
                        template_spec = spec.get('template', {}).get('spec', {})
                        containers = template_spec.get('containers', [])
                        
                        # Extract container image info
                        if containers and 'image' in containers[0]:
                            image = containers[0]['image']
                            if ':' in image:
                                registry_path, tag = image.rsplit(':', 1)
                                deployment_info["container_registry"] = registry_path
                                deployment_info["image_tag"] = tag
                            else:
                                deployment_info["container_registry"] = image
                        
                        # Check for health checks
                        if containers and 'readinessProbe' in containers[0]:
                            deployment_info["health_checks"]["readiness"] = True
                        
                        if containers and 'livenessProbe' in containers[0]:
                            deployment_info["health_checks"]["liveness"] = True
                        
                        # Check for HPA
                        if 'replicas' in spec:
                            deployment_info["scaling"]["min_replicas"] = spec['replicas']
                            deployment_info["scaling"]["max_replicas"] = spec['replicas']
        except Exception as e:
            print(f"Error parsing Kubernetes manifest for deployment info: {e}")
    
    # Check for HPA in kustomize directory
    hpa_path = os.path.join(MICROSERVICES_REPO, f"kustomize/components/autoscaling/{service_name}-hpa.yaml")
    if os.path.exists(hpa_path):
        try:
            with open(hpa_path, 'r') as f:
                hpa = yaml.safe_load(f)
                if hpa and hpa.get('kind') == 'HorizontalPodAutoscaler':
                    deployment_info["scaling"]["auto_scaling"] = True
                    spec = hpa.get('spec', {})
                    if 'minReplicas' in spec:
                        deployment_info["scaling"]["min_replicas"] = spec['minReplicas']
                    if 'maxReplicas' in spec:
                        deployment_info["scaling"]["max_replicas"] = spec['maxReplicas']
        except Exception as e:
            print(f"Error parsing HPA manifest: {e}")
    
    return deployment_info

# Function to generate complete service inventory
def generate_service_inventory():
    """Generate complete service inventory data"""
    print("=== Service Inventory Generator ===\n")
    print("Analyzing microservices repository...\n")
    
    services_data = []
    
    for service in SERVICES:
        print(f"Processing {service['name']}...")
        
        # Extract all service details
        dependencies = extract_dependencies(service)
        infrastructure = extract_infrastructure(service)
        api_info = extract_api_endpoints(service)
        code_metrics = extract_code_metrics(service)
        deployment_info = extract_deployment_info(service)
        
        # Build complete service data
        service_data = {
            "name": service["name"],
            "description": service["description"],
            "language": service["language"],
            "path": service["path"],
            "dependencies": dependencies,
            "infrastructure": infrastructure,
            "api": api_info,
            "code_metrics": code_metrics,
            "deployment": deployment_info
        }
        
        services_data.append(service_data)
    
    # Create summary data
    summary = {
        "total_services": len(services_data),
        "languages": {},
        "total_dependencies": sum(len(s["dependencies"]) for s in services_data),
        "total_endpoints": sum(len(s["api"]["endpoints"]) + len(s["api"]["server_endpoints"]) for s in services_data),
        "total_loc": sum(s["code_metrics"]["loc"] for s in services_data),
        "generated_at": datetime.now().isoformat()
    }
    
    # Count languages
    for service in services_data:
        lang = service["language"]
        summary["languages"][lang] = summary["languages"].get(lang, 0) + 1
    
    # Create final data structure
    inventory_data = {
        "summary": summary,
        "services": services_data
    }
    
    # Save to file
    output_file = os.path.join(OUTPUT_DIR, "service_inventory.json")
    with open(output_file, 'w') as f:
        json.dump(inventory_data, f, indent=2)
    
    # Copy to public data directory
    public_file = os.path.join(PUBLIC_DATA_DIR, "service_inventory.json")
    with open(public_file, 'w') as f:
        json.dump(inventory_data, f, indent=2)
    
    print(f"\n✓ Service inventory data generated successfully!")
    print(f"✓ Saved to: {output_file}")
    print(f"✓ Copied to: {public_file}")
    
    print("\nSummary:")
    print(f"  Total Services: {summary['total_services']}")
    print(f"  Languages: {', '.join([f'{k} ({v})' for k, v in summary['languages'].items()])}")
    print(f"  Total Dependencies: {summary['total_dependencies']}")
    print(f"  Total Endpoints: {summary['total_endpoints']}")
    print(f"  Total Lines of Code: {summary['total_loc']}")
    
    return inventory_data

# Run the generator if executed directly
if __name__ == "__main__":
    generate_service_inventory()
