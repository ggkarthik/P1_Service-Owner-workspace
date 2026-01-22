#!/usr/bin/env python3
"""
Generate service owner risk data for the microservices-demo application.
This script creates comprehensive security risk data at a service level,
including risk scores, remediation progress, business impact, and AI insights.
"""

import json
import random
from datetime import datetime, timedelta
from pathlib import Path

# Service definitions from the microservices-demo app
SERVICES = [
    {
        "name": "frontend",
        "language": "Go",
        "description": "Exposes an HTTP server to serve the website",
        "business_criticality": "Critical",
        "user_facing": True,
        "dependencies": ["productcatalogservice", "currencyservice", "cartservice", "recommendationservice", "checkoutservice", "adservice", "shippingservice"]
    },
    {
        "name": "cartservice",
        "language": "C#",
        "description": "Stores shopping cart items in Redis",
        "business_criticality": "High",
        "user_facing": False,
        "dependencies": ["redis"]
    },
    {
        "name": "productcatalogservice",
        "language": "Go",
        "description": "Provides product listings and search",
        "business_criticality": "High",
        "user_facing": False,
        "dependencies": []
    },
    {
        "name": "currencyservice",
        "language": "Node.js",
        "description": "Converts money amounts between currencies",
        "business_criticality": "Medium",
        "user_facing": False,
        "dependencies": []
    },
    {
        "name": "paymentservice",
        "language": "Node.js",
        "description": "Processes payments (mock)",
        "business_criticality": "Critical",
        "user_facing": False,
        "dependencies": []
    },
    {
        "name": "shippingservice",
        "language": "Go",
        "description": "Calculates shipping costs",
        "business_criticality": "Medium",
        "user_facing": False,
        "dependencies": []
    },
    {
        "name": "emailservice",
        "language": "Python",
        "description": "Sends order confirmation emails (mock)",
        "business_criticality": "Low",
        "user_facing": False,
        "dependencies": []
    },
    {
        "name": "checkoutservice",
        "language": "Go",
        "description": "Orchestrates the checkout process",
        "business_criticality": "Critical",
        "user_facing": False,
        "dependencies": ["productcatalogservice", "shippingservice", "currencyservice", "emailservice", "paymentservice", "cartservice"]
    },
    {
        "name": "recommendationservice",
        "language": "Python",
        "description": "Recommends related products",
        "business_criticality": "Low",
        "user_facing": False,
        "dependencies": ["productcatalogservice"]
    },
    {
        "name": "adservice",
        "language": "Java",
        "description": "Provides text ads based on context",
        "business_criticality": "Low",
        "user_facing": False,
        "dependencies": []
    },
    {
        "name": "loadgenerator",
        "language": "Python",
        "description": "Simulates user traffic",
        "business_criticality": "Low",
        "user_facing": False,
        "dependencies": ["frontend"]
    },
    {
        "name": "shoppingassistantservice",
        "language": "Python",
        "description": "AI assistant for product suggestions",
        "business_criticality": "Medium",
        "user_facing": True,
        "dependencies": ["productcatalogservice"]
    }
]

VULNERABILITY_TYPES = [
    "SQL Injection",
    "Cross-Site Scripting (XSS)",
    "Insecure Deserialization",
    "Security Misconfiguration",
    "Sensitive Data Exposure",
    "XML External Entities (XXE)",
    "Broken Access Control",
    "Security Logging Failures",
    "Server-Side Request Forgery (SSRF)",
    "Outdated Dependencies"
]

COMPLIANCE_FRAMEWORKS = [
    "PCI-DSS", "SOC 2", "ISO 27001", "GDPR", "HIPAA", "NIST"
]

AI_INSIGHTS = [
    "Vulnerabilities likely to be exploited up {percent}% in {days} days",
    "Attack surface increased by {percent}% in the last {days} days",
    "Similar vulnerabilities exploited in {count} recent breaches",
    "Remediation velocity decreased by {percent}% this month",
    "High correlation between this service and recent incidents",
    "Dependencies contain {count} known vulnerable packages",
    "Service exposure increased due to new API endpoints",
    "Mean time to remediate (MTTR) is {days} days above average"
]

AI_RECOMMENDATIONS = [
    "Patch critical assets immediately to reduce risk by {percent}%",
    "Update {package} to version {version} to fix {count} vulnerabilities",
    "Implement rate limiting on exposed endpoints",
    "Enable security headers (CSP, HSTS, X-Frame-Options)",
    "Rotate credentials found in recent security scan",
    "Apply network segmentation to isolate this service",
    "Implement input validation for all user-facing endpoints",
    "Review and update access control policies",
    "Enable audit logging for all critical operations",
    "Conduct security testing before next deployment"
]

def calculate_risk_score(service, vulnerabilities):
    """Calculate risk score based on vulnerabilities and business criticality."""
    base_score = 0
    
    # Add points for each vulnerability based on severity
    severity_weights = {"Critical": 25, "High": 15, "Medium": 8, "Low": 3}
    for vuln in vulnerabilities:
        base_score += severity_weights.get(vuln["severity"], 0)
    
    # Multiply by business criticality factor
    criticality_factor = {"Critical": 1.5, "High": 1.2, "Medium": 1.0, "Low": 0.7}
    risk_score = base_score * criticality_factor[service["business_criticality"]]
    
    # Add risk from user-facing services
    if service["user_facing"]:
        risk_score *= 1.3
    
    # Cap at 100
    return min(int(risk_score), 100)

def generate_vulnerabilities(service, count_range=(2, 8)):
    """Generate random vulnerabilities for a service."""
    count = random.randint(*count_range)
    severities = ["Critical", "High", "Medium", "Low"]
    
    vulnerabilities = []
    for i in range(count):
        severity = random.choices(
            severities,
            weights=[0.1, 0.3, 0.4, 0.2]  # More medium/high than critical/low
        )[0]
        
        vuln = {
            "id": f"VULN-{service['name'].upper()}-{i+1:03d}",
            "type": random.choice(VULNERABILITY_TYPES),
            "severity": severity,
            "cvss_score": round(random.uniform(3.0, 9.9), 1),
            "cve": f"CVE-2024-{random.randint(10000, 99999)}",
            "package": f"{random.choice(['express', 'django', 'spring', 'dotnet', 'redis-client'])}-{random.randint(1, 5)}.{random.randint(0, 9)}.{random.randint(0, 20)}",
            "description": f"{random.choice(VULNERABILITY_TYPES)} vulnerability in {service['name']}",
            "discovered_date": (datetime.now() - timedelta(days=random.randint(1, 90))).isoformat(),
            "status": random.choice(["Open", "In Progress", "Resolved", "Mitigated"]),
            "exploitability": random.choice(["High", "Medium", "Low"]),
            "business_impact": random.choice(["Critical", "High", "Medium", "Low"]),
            "assigned_team": random.choice(["Security Team", "DevOps Team", "Platform Team", service["name"].title() + " Team"]),
            "sla_breach": random.choice([True, False]) if severity in ["Critical", "High"] else False
        }
        vulnerabilities.append(vuln)
    
    return vulnerabilities

def generate_exposure_data(service):
    """Generate exposure data for a service."""
    total_endpoints = len(service.get("dependencies", [])) + random.randint(3, 10)
    
    return {
        "total_endpoints": total_endpoints,
        "public_endpoints": random.randint(0, min(3, total_endpoints)) if service["user_facing"] else 0,
        "internal_endpoints": total_endpoints - (random.randint(0, min(3, total_endpoints)) if service["user_facing"] else 0),
        "exposed_secrets": random.randint(0, 3),
        "open_ports": random.randint(1, 5),
        "network_exposure": "Internet" if service["user_facing"] else random.choice(["Internal", "VPC"]),
        "trend_30d": [random.randint(5, 20) for _ in range(30)]
    }

def generate_remediation_data():
    """Generate remediation progress data."""
    return {
        "breaches": random.randint(0, 3),
        "open_vulnerabilities": random.randint(5, 50),
        "in_progress": random.randint(3, 20),
        "resolved_30d": random.randint(10, 40),
        "mttr_hours": random.randint(24, 240),
        "assigned_teams": random.randint(2, 5),
        "overdue_count": random.randint(0, 10),
        "trend_30d": [random.randint(5, 30) for _ in range(30)]
    }

def generate_compliance_data():
    """Generate compliance posture data."""
    frameworks = random.sample(COMPLIANCE_FRAMEWORKS, k=random.randint(2, 4))
    
    return {
        "adherence_score": random.randint(65, 95),
        "applicable_frameworks": frameworks,
        "policy_violations": random.randint(0, 5),
        "failed_controls": random.randint(0, 8),
        "last_audit_date": (datetime.now() - timedelta(days=random.randint(1, 180))).isoformat(),
        "next_audit_date": (datetime.now() + timedelta(days=random.randint(30, 180))).isoformat(),
        "control_status": {
            "passed": random.randint(20, 50),
            "failed": random.randint(0, 8),
            "not_applicable": random.randint(5, 15)
        }
    }

def generate_ai_insights(service, vulnerabilities, risk_score):
    """Generate AI-powered insights and recommendations."""
    insights = []
    recommendations = []
    
    # Generate 2-4 insights
    for _ in range(random.randint(2, 4)):
        template = random.choice(AI_INSIGHTS)
        insight = template.format(
            percent=random.randint(10, 50),
            days=random.choice([7, 14, 30, 60]),
            count=random.randint(3, 20)
        )
        insights.append(insight)
    
    # Generate 2-5 recommendations
    for _ in range(random.randint(2, 5)):
        template = random.choice(AI_RECOMMENDATIONS)
        recommendation = template.format(
            percent=random.randint(20, 60),
            package=random.choice(["express", "django", "spring-core", "redis-client", "grpc"]),
            version=f"{random.randint(2, 6)}.{random.randint(0, 9)}.{random.randint(0, 20)}",
            count=random.randint(3, 15)
        )
        recommendations.append({
            "text": recommendation,
            "priority": random.choice(["High", "Medium", "Low"]),
            "impact": random.choice(["Critical", "High", "Medium", "Low"]),
            "effort": random.choice(["Low", "Medium", "High"])
        })
    
    return {
        "insights": insights,
        "recommendations": recommendations,
        "risk_trend": "increasing" if risk_score > 70 else "stable" if risk_score > 40 else "decreasing",
        "predicted_risk_30d": min(100, risk_score + random.randint(-10, 20)),
        "confidence_score": round(random.uniform(0.7, 0.95), 2)
    }

def generate_service_composition(service):
    """Generate service composition data."""
    return {
        "containers": random.randint(1, 5),
        "pods": random.randint(2, 10),
        "replicas": random.randint(2, 6),
        "dependencies": service.get("dependencies", []),
        "dependency_count": len(service.get("dependencies", [])),
        "language": service["language"],
        "frameworks": get_frameworks_for_language(service["language"]),
        "deployment_type": random.choice(["Kubernetes", "Cloud Run", "GKE"]),
        "resource_usage": {
            "cpu": f"{random.randint(10, 80)}%",
            "memory": f"{random.randint(20, 85)}%",
            "disk": f"{random.randint(15, 70)}%"
        }
    }

def get_frameworks_for_language(language):
    """Get common frameworks for a given language."""
    framework_map = {
        "Go": ["gRPC", "Gin", "Echo"],
        "Python": ["gRPC", "Flask", "FastAPI"],
        "Node.js": ["Express", "gRPC-js"],
        "Java": ["Spring Boot", "gRPC-Java"],
        "C#": [".NET Core", "gRPC-dotnet"]
    }
    return framework_map.get(language, ["gRPC"])

def generate_service_owner_data():
    """Generate complete service owner workspace data."""
    print("Generating service owner risk data...")
    
    services_data = []
    
    for service in SERVICES:
        print(f"  Processing {service['name']}...")
        
        # Generate vulnerabilities
        vulnerabilities = generate_vulnerabilities(service)
        
        # Calculate risk score
        risk_score = calculate_risk_score(service, vulnerabilities)
        
        # Group vulnerabilities by severity
        vuln_by_severity = {
            "Critical": [],
            "High": [],
            "Medium": [],
            "Low": []
        }
        for vuln in vulnerabilities:
            vuln_by_severity[vuln["severity"]].append(vuln)
        
        # Build service data
        service_data = {
            "name": service["name"],
            "description": service["description"],
            "language": service["language"],
            "business_criticality": service["business_criticality"],
            "user_facing": service["user_facing"],
            "owner": {
                "team": service["name"].title() + " Team",
                "lead": f"{random.choice(['Sarah', 'Michael', 'Emma', 'David', 'Lisa'])} {random.choice(['Johnson', 'Smith', 'Williams', 'Brown', 'Davis'])}",
                "email": f"{service['name']}-team@example.com",
                "slack_channel": f"#team-{service['name']}"
            },
            "risk": {
                "score": risk_score,
                "level": "Critical" if risk_score >= 80 else "High" if risk_score >= 60 else "Medium" if risk_score >= 40 else "Low",
                "business_impact": service["business_criticality"],
                "trend_30d": [max(0, min(100, risk_score + random.randint(-15, 15))) for _ in range(30)],
                "last_updated": datetime.now().isoformat()
            },
            "vulnerabilities": {
                "total": len(vulnerabilities),
                "by_severity": {
                    "Critical": len(vuln_by_severity["Critical"]),
                    "High": len(vuln_by_severity["High"]),
                    "Medium": len(vuln_by_severity["Medium"]),
                    "Low": len(vuln_by_severity["Low"])
                },
                "details": vulnerabilities,
                "open": len([v for v in vulnerabilities if v["status"] == "Open"]),
                "in_progress": len([v for v in vulnerabilities if v["status"] == "In Progress"]),
                "resolved_30d": random.randint(5, 25)
            },
            "exposure": generate_exposure_data(service),
            "remediation": generate_remediation_data(),
            "compliance": generate_compliance_data(),
            "composition": generate_service_composition(service),
            "ai_insights": generate_ai_insights(service, vulnerabilities, risk_score)
        }
        
        services_data.append(service_data)
    
    # Generate summary data
    summary = {
        "total_services": len(services_data),
        "critical_risk_services": len([s for s in services_data if s["risk"]["score"] >= 80]),
        "high_risk_services": len([s for s in services_data if 60 <= s["risk"]["score"] < 80]),
        "medium_risk_services": len([s for s in services_data if 40 <= s["risk"]["score"] < 60]),
        "low_risk_services": len([s for s in services_data if s["risk"]["score"] < 40]),
        "total_vulnerabilities": sum(s["vulnerabilities"]["total"] for s in services_data),
        "critical_vulnerabilities": sum(s["vulnerabilities"]["by_severity"]["Critical"] for s in services_data),
        "average_risk_score": round(sum(s["risk"]["score"] for s in services_data) / len(services_data), 1),
        "average_mttr_hours": round(sum(s["remediation"]["mttr_hours"] for s in services_data) / len(services_data), 1),
        "generated_at": datetime.now().isoformat()
    }
    
    return {
        "summary": summary,
        "services": services_data
    }

def main():
    """Main function to generate and save service owner data."""
    print("=== Service Owner Risk Data Generator ===\n")
    
    # Generate data
    data = generate_service_owner_data()
    
    # Ensure output directory exists
    output_dir = Path(__file__).parent / "data" / "generated"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Save to file
    output_file = output_dir / "service_owner_data.json"
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"\n✓ Service owner data generated successfully!")
    print(f"✓ Saved to: {output_file}")
    print(f"\nSummary:")
    print(f"  Total Services: {data['summary']['total_services']}")
    print(f"  Critical Risk: {data['summary']['critical_risk_services']}")
    print(f"  High Risk: {data['summary']['high_risk_services']}")
    print(f"  Total Vulnerabilities: {data['summary']['total_vulnerabilities']}")
    print(f"  Average Risk Score: {data['summary']['average_risk_score']}")

if __name__ == "__main__":
    main()
