import json
import random
from datetime import datetime, timedelta

# Common packages across different package managers
packages = [
    {
        "name": "chardet",
        "description": "Universal encoding detector for Python 3",
        "package_manager": "pypi",
        "version": "5.1.0",
        "license": "LGPL-2.1-only",
        "tags": ["encoding", "linguistic", "i18n"],
        "popularity": 76,
        "contributors": 48,
        "security": 92,
        "repository_url": "https://github.com/chardet/chardet",
        "used_by": ["emailservice", "recommendationservice", "loadgenerator", "shoppingassistantservice"],
        "used_in_files": [
            "emailservice/requirements.txt", 
            "recommendationservice/requirements.txt", 
            "shoppingassistantservice/requirements.txt"
        ],
        "vulnerabilities": []
    },
    {
        "name": "axios",
        "description": "Promise based HTTP client for the browser and node.js",
        "package_manager": "npm",
        "version": "0.21.4",
        "license": "MIT",
        "tags": ["http", "request", "ajax", "promise"],
        "popularity": 92,
        "contributors": 325,
        "security": 78,
        "repository_url": "https://github.com/axios/axios",
        "used_by": ["currencyservice", "paymentservice"],
        "used_in_files": [
            "currencyservice/package.json", 
            "paymentservice/package.json"
        ],
        "vulnerabilities": [
            {
                "id": "CVE-2023-45857",
                "severity": "Medium",
                "description": "Axios vulnerable to ReDoS via malicious server",
                "fixed_in": "1.6.0"
            }
        ]
    },
    {
        "name": "lodash",
        "description": "Lodash modular utilities",
        "package_manager": "npm",
        "version": "4.17.20",
        "license": "MIT",
        "tags": ["utility", "javascript", "library", "functional"],
        "popularity": 98,
        "contributors": 292,
        "security": 75,
        "repository_url": "https://github.com/lodash/lodash",
        "used_by": ["currencyservice", "paymentservice"],
        "used_in_files": [
            "currencyservice/package.json", 
            "paymentservice/package.json"
        ],
        "vulnerabilities": [
            {
                "id": "CVE-2021-23337",
                "severity": "High",
                "description": "Command Injection in lodash",
                "fixed_in": "4.17.21"
            }
        ]
    },
    {
        "name": "protobuf",
        "description": "Protocol Buffers - Google's data interchange format",
        "package_manager": "nuget",
        "version": "3.19.4",
        "license": "BSD-3-Clause",
        "tags": ["protobuf", "serialization", "grpc"],
        "popularity": 85,
        "contributors": 64,
        "security": 89,
        "repository_url": "https://github.com/protocolbuffers/protobuf",
        "used_by": ["cartservice"],
        "used_in_files": [
            "cartservice/cartservice.csproj"
        ],
        "vulnerabilities": []
    },
    {
        "name": "Newtonsoft.Json",
        "description": "Json.NET is a popular high-performance JSON framework for .NET",
        "package_manager": "nuget",
        "version": "13.0.1",
        "license": "MIT",
        "tags": ["json", "serialization", "parser"],
        "popularity": 96,
        "contributors": 148,
        "security": 90,
        "repository_url": "https://github.com/JamesNK/Newtonsoft.Json",
        "used_by": ["cartservice"],
        "used_in_files": [
            "cartservice/cartservice.csproj"
        ],
        "vulnerabilities": []
    },
    {
        "name": "grpc",
        "description": "gRPC - high performance, open source, general RPC framework",
        "package_manager": "pypi",
        "version": "1.44.0",
        "license": "Apache-2.0",
        "tags": ["grpc", "rpc", "microservices"],
        "popularity": 88,
        "contributors": 573,
        "security": 85,
        "repository_url": "https://github.com/grpc/grpc",
        "used_by": ["emailservice", "recommendationservice", "shoppingassistantservice"],
        "used_in_files": [
            "emailservice/requirements.txt", 
            "recommendationservice/requirements.txt", 
            "shoppingassistantservice/requirements.txt"
        ],
        "vulnerabilities": []
    },
    {
        "name": "com.google.protobuf:protobuf-java",
        "description": "Core Protocol Buffers library for Java",
        "package_manager": "maven",
        "version": "3.19.4",
        "license": "BSD-3-Clause",
        "tags": ["protobuf", "serialization", "grpc"],
        "popularity": 82,
        "contributors": 64,
        "security": 87,
        "repository_url": "https://github.com/protocolbuffers/protobuf",
        "used_by": ["adservice"],
        "used_in_files": [
            "adservice/pom.xml"
        ],
        "vulnerabilities": []
    },
    {
        "name": "golang.org/x/net",
        "description": "Go supplementary network libraries",
        "package_manager": "go",
        "version": "v0.5.0",
        "license": "BSD-3-Clause",
        "tags": ["go", "network", "http2", "websocket"],
        "popularity": 90,
        "contributors": 278,
        "security": 81,
        "repository_url": "https://github.com/golang/net",
        "used_by": ["frontend", "checkoutservice", "productcatalogservice", "shippingservice"],
        "used_in_files": [
            "frontend/go.mod", 
            "checkoutservice/go.mod", 
            "productcatalogservice/go.mod", 
            "shippingservice/go.mod"
        ],
        "vulnerabilities": [
            {
                "id": "CVE-2023-3978",
                "severity": "Medium",
                "description": "Improper handling of abnormal packets in golang.org/x/net/html",
                "fixed_in": "v0.8.0"
            }
        ]
    },
    {
        "name": "google.golang.org/grpc",
        "description": "The Go language implementation of gRPC",
        "package_manager": "go",
        "version": "v1.44.0",
        "license": "Apache-2.0",
        "tags": ["grpc", "rpc", "go"],
        "popularity": 91,
        "contributors": 432,
        "security": 88,
        "repository_url": "https://github.com/grpc/grpc-go",
        "used_by": ["frontend", "checkoutservice", "productcatalogservice", "shippingservice"],
        "used_in_files": [
            "frontend/go.mod", 
            "checkoutservice/go.mod", 
            "productcatalogservice/go.mod", 
            "shippingservice/go.mod"
        ],
        "vulnerabilities": []
    },
    {
        "name": "express",
        "description": "Fast, unopinionated, minimalist web framework for Node.js",
        "package_manager": "npm",
        "version": "4.17.1",
        "license": "MIT",
        "tags": ["web", "framework", "http", "rest", "api"],
        "popularity": 97,
        "contributors": 262,
        "security": 83,
        "repository_url": "https://github.com/expressjs/express",
        "used_by": ["currencyservice", "paymentservice"],
        "used_in_files": [
            "currencyservice/package.json", 
            "paymentservice/package.json"
        ],
        "vulnerabilities": []
    }
]

# Additional sample packages with various properties
additional_package_names = [
    "requests", "flask", "django", "numpy", "pandas", "react", "bootstrap", "jquery", "moment", "mocha", 
    "chai", "jest", "pytest", "sphinx", "babel", "webpack", "eslint", "pylint", "autopep8", "prettier"
]

package_managers = ["pypi", "npm", "maven", "nuget", "go", "cargo"]
licenses = ["MIT", "Apache-2.0", "BSD-3-Clause", "GPL-3.0", "LGPL-2.1", "MPL-2.0"]
tags_by_manager = {
    "pypi": ["python", "web", "data", "testing", "api", "async", "database", "cli", "gui"],
    "npm": ["javascript", "frontend", "react", "vue", "angular", "node", "ui", "testing"],
    "maven": ["java", "spring", "android", "api", "testing", "logging", "database"],
    "nuget": ["dotnet", "csharp", "aspnet", "wpf", "xamarin", "unity", "testing"],
    "go": ["golang", "web", "database", "api", "cli", "testing", "network"],
    "cargo": ["rust", "web", "async", "cli", "database", "api", "testing"]
}

# Generate additional random packages
for i in range(30):
    name = random.choice(additional_package_names)
    package_manager = random.choice(package_managers)
    
    # Generate version
    major = random.randint(0, 5)
    minor = random.randint(0, 15)
    patch = random.randint(0, 20)
    version = f"{major}.{minor}.{patch}"
    
    # Generate random tags
    available_tags = tags_by_manager[package_manager]
    tag_count = random.randint(1, 4)
    tags = random.sample(available_tags, min(tag_count, len(available_tags)))
    
    # Randomize other attributes
    popularity = random.randint(20, 99)
    contributors = random.randint(5, 350)
    security = random.randint(50, 99)
    
    # Generate random vulnerabilities (30% chance)
    vulnerabilities = []
    if random.random() < 0.3:
        vuln_count = random.randint(1, 3)
        for j in range(vuln_count):
            severity = random.choice(["Low", "Medium", "High", "Critical"])
            vulnerabilities.append({
                "id": f"CVE-20{random.randint(19, 23)}-{random.randint(1000, 9999)}",
                "severity": severity,
                "description": f"Random security vulnerability in {name}",
                "fixed_in": f"{major}.{minor}.{random.randint(patch+1, patch+5)}"
            })
    
    # Build the package object
    package = {
        "name": name,
        "description": f"Random package {i+1} for {package_manager}",
        "package_manager": package_manager,
        "version": version,
        "license": random.choice(licenses),
        "tags": tags,
        "popularity": popularity,
        "contributors": contributors,
        "security": security,
        "repository_url": f"https://github.com/example/{name}",
        "used_by": [],
        "used_in_files": [],
        "vulnerabilities": vulnerabilities
    }
    
    # Add to packages list if not already present with the same name and package manager
    if not any(p["name"] == name and p["package_manager"] == package_manager for p in packages):
        packages.append(package)

# Write to a JSON file
output_path = "react-dashboard/public/data/package_data.json"
import os
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w") as f:
    json.dump({"packages": packages}, f, indent=2)

print(f"Generated {output_path} with {len(packages)} packages")
