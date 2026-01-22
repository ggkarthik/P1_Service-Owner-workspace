#!/usr/bin/env python3
"""
Centralized Configuration for Identity-Online-Repo

This module provides centralized configuration for all data generation scripts,
analysis tools, and the React dashboard.
"""

import os

# ============================================================================
# BASE DIRECTORIES
# ============================================================================

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

# Data directories
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
DATA_GENERATED_DIR = os.path.join(DATA_DIR, "generated")
DATA_CACHE_DIR = os.path.join(DATA_DIR, "cache")
DATA_SCHEMAS_DIR = os.path.join(DATA_DIR, "schemas")

# Legacy output directory (for backward compatibility)
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "output")

# React dashboard directories
REACT_DASHBOARD_DIR = os.path.join(PROJECT_ROOT, "react-dashboard")
REACT_SRC_DATA_DIR = os.path.join(REACT_DASHBOARD_DIR, "src", "data")
REACT_PUBLIC_DATA_DIR = os.path.join(REACT_DASHBOARD_DIR, "public", "data")

# Ensure all directories exist
REQUIRED_DIRS = [
    DATA_DIR,
    DATA_GENERATED_DIR,
    DATA_CACHE_DIR,
    DATA_SCHEMAS_DIR,
    OUTPUT_DIR,
    REACT_SRC_DATA_DIR,
    REACT_PUBLIC_DATA_DIR,
]

for directory in REQUIRED_DIRS:
    os.makedirs(directory, exist_ok=True)

# ============================================================================
# DATA FILE NAMES
# ============================================================================

DATA_FILES = {
    # Inventory data
    'inventory': 'microservices_inventory.json',
    'image_inventory': 'image_inventory.json',
    
    # Security data
    'security': 'security_findings.json',
    'opensource_security': 'opensource_security.json',
    
    # Dependency and technology data
    'dependencies': 'dependencies_data.json',
    'technologies': 'technologies_data.json',
    
    # Image data
    'base_images': 'base_images_data.json',
    'packages': 'package_data.json',
    
    # Activity data
    'activity': 'repo_activity_summary.json',
}

# ============================================================================
# API SETTINGS
# ============================================================================

# GitHub API
GITHUB_API_BASE = "https://api.github.com"
GITHUB_REPO_OWNER = "GoogleCloudPlatform"
GITHUB_REPO_NAME = "microservices-demo"
GITHUB_REPO = f"{GITHUB_REPO_OWNER}/{GITHUB_REPO_NAME}"
GITHUB_API_TIMEOUT = 30  # seconds

# API rate limiting
API_RATE_LIMIT_DELAY = 1  # seconds between requests
API_MAX_RETRIES = 3

# ============================================================================
# DATA GENERATION SETTINGS
# ============================================================================

# Sample data sizes
SAMPLE_SIZE = {
    'microservices': 12,
    'packages': 50,
    'images': 12,
    'vulnerabilities': 100,
    'pull_requests': 5,
    'commits_per_pr': 10,
    'base_images': 15,
}

# Vulnerability severity distribution (percentage)
VULNERABILITY_DISTRIBUTION = {
    'critical': 0.10,  # 10%
    'high': 0.25,      # 25%
    'medium': 0.40,    # 40%
    'low': 0.25,       # 25%
}

# ============================================================================
# LOGGING SETTINGS
# ============================================================================

LOG_LEVEL = "INFO"  # DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
LOG_DATE_FORMAT = '%Y-%m-%d %H:%M:%S'

# ============================================================================
# FEATURE FLAGS
# ============================================================================

FEATURES = {
    'enable_caching': True,
    'enable_validation': True,
    'enable_real_time_updates': False,
    'enable_export': True,
    'enable_search': True,
}

# ============================================================================
# CACHE SETTINGS
# ============================================================================

CACHE_ENABLED = FEATURES['enable_caching']
CACHE_TTL = 300  # seconds (5 minutes)
CACHE_MAX_SIZE = 100  # maximum number of cached items

# ============================================================================
# VALIDATION SETTINGS
# ============================================================================

VALIDATION_ENABLED = FEATURES['enable_validation']
VALIDATION_STRICT = False  # If True, validation errors will stop execution

# ============================================================================
# MICROSERVICES CONFIGURATION
# ============================================================================

# List of microservices in the demo application
MICROSERVICES = [
    {
        'name': 'frontend',
        'language': 'Go',
        'description': 'Exposes an HTTP server to serve the website',
    },
    {
        'name': 'cartservice',
        'language': 'C#',
        'description': 'Stores shopping cart items in Redis',
    },
    {
        'name': 'productcatalogservice',
        'language': 'Go',
        'description': 'Provides product listings and search',
    },
    {
        'name': 'currencyservice',
        'language': 'Node.js',
        'description': 'Converts money amounts between currencies',
    },
    {
        'name': 'paymentservice',
        'language': 'Node.js',
        'description': 'Processes payments (mock)',
    },
    {
        'name': 'shippingservice',
        'language': 'Go',
        'description': 'Calculates shipping costs and handles shipping (mock)',
    },
    {
        'name': 'emailservice',
        'language': 'Python',
        'description': 'Sends order confirmation emails (mock)',
    },
    {
        'name': 'checkoutservice',
        'language': 'Go',
        'description': 'Orchestrates the checkout process',
    },
    {
        'name': 'recommendationservice',
        'language': 'Python',
        'description': 'Recommends related products',
    },
    {
        'name': 'adservice',
        'language': 'Java',
        'description': 'Provides text ads based on context',
    },
    {
        'name': 'loadgenerator',
        'language': 'Python',
        'description': 'Simulates user traffic',
    },
    {
        'name': 'shoppingassistantservice',
        'language': 'Python',
        'description': 'AI assistant for product suggestions',
    },
]

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_data_file_path(file_key, location='generated'):
    """
    Get the full path for a data file.
    
    Args:
        file_key: Key from DATA_FILES dict
        location: 'generated', 'cache', 'output', 'react_src', or 'react_public'
    
    Returns:
        Full path to the data file
    """
    if file_key not in DATA_FILES:
        raise ValueError(f"Unknown data file key: {file_key}")
    
    filename = DATA_FILES[file_key]
    
    if location == 'generated':
        return os.path.join(DATA_GENERATED_DIR, filename)
    elif location == 'cache':
        return os.path.join(DATA_CACHE_DIR, filename)
    elif location == 'output':
        return os.path.join(OUTPUT_DIR, filename)
    elif location == 'react_src':
        return os.path.join(REACT_SRC_DATA_DIR, filename)
    elif location == 'react_public':
        return os.path.join(REACT_PUBLIC_DATA_DIR, filename)
    else:
        raise ValueError(f"Unknown location: {location}")


def get_all_output_paths(file_key):
    """
    Get all output paths for a data file (for backward compatibility).
    
    Args:
        file_key: Key from DATA_FILES dict
    
    Returns:
        List of paths where the file should be saved
    """
    return [
        get_data_file_path(file_key, 'generated'),
        get_data_file_path(file_key, 'output'),
        get_data_file_path(file_key, 'react_public'),
    ]


def get_microservice_by_name(name):
    """
    Get microservice configuration by name.
    
    Args:
        name: Name of the microservice
    
    Returns:
        Microservice configuration dict or None
    """
    for ms in MICROSERVICES:
        if ms['name'] == name:
            return ms
    return None


# ============================================================================
# CONFIGURATION VALIDATION
# ============================================================================

def validate_config():
    """Validate configuration settings."""
    errors = []
    
    # Check that all required directories exist
    for directory in REQUIRED_DIRS:
        if not os.path.exists(directory):
            errors.append(f"Required directory does not exist: {directory}")
    
    # Check that sample sizes are positive
    for key, value in SAMPLE_SIZE.items():
        if value <= 0:
            errors.append(f"Sample size for {key} must be positive: {value}")
    
    # Check that vulnerability distribution sums to 1.0
    total_distribution = sum(VULNERABILITY_DISTRIBUTION.values())
    if abs(total_distribution - 1.0) > 0.01:
        errors.append(f"Vulnerability distribution must sum to 1.0, got {total_distribution}")
    
    if errors:
        print("Configuration validation errors:")
        for error in errors:
            print(f"  - {error}")
        return False
    
    return True


# Validate configuration on import
if __name__ != "__main__":
    if not validate_config():
        print("Warning: Configuration validation failed. Some features may not work correctly.")


# ============================================================================
# MAIN (for testing)
# ============================================================================

if __name__ == "__main__":
    print("Identity-Online-Repo Configuration")
    print("=" * 80)
    print(f"\nProject Root: {PROJECT_ROOT}")
    print(f"\nData Directories:")
    print(f"  Generated: {DATA_GENERATED_DIR}")
    print(f"  Cache: {DATA_CACHE_DIR}")
    print(f"  Schemas: {DATA_SCHEMAS_DIR}")
    print(f"\nReact Dashboard:")
    print(f"  Root: {REACT_DASHBOARD_DIR}")
    print(f"  Public Data: {REACT_PUBLIC_DATA_DIR}")
    print(f"\nGitHub Repository: {GITHUB_REPO}")
    print(f"\nMicroservices: {len(MICROSERVICES)}")
    for ms in MICROSERVICES:
        print(f"  - {ms['name']} ({ms['language']})")
    print(f"\nFeatures:")
    for feature, enabled in FEATURES.items():
        status = "✓" if enabled else "✗"
        print(f"  {status} {feature}")
    print(f"\nValidation: ", end="")
    if validate_config():
        print("✓ PASSED")
    else:
        print("✗ FAILED")
