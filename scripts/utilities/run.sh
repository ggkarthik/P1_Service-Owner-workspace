#!/bin/bash
#
# Unified Run Script for Identity-Online-Repo
#
# This script provides a single entry point for all common operations:
# - Starting the React dashboard
# - Generating fresh data
# - Running analysis
# - Setup and maintenance tasks
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to show usage
show_usage() {
    cat << EOF
${GREEN}Identity-Online-Repo - Unified Run Script${NC}

Usage: ./run.sh [COMMAND] [OPTIONS]

${YELLOW}Commands:${NC}
  start              Start the React dashboard (default)
  start-fresh        Generate fresh data, then start dashboard
  generate           Generate all data without starting dashboard
  analyze            Analyze repository and generate inventory
  setup              Install dependencies and setup project
  test               Run tests
  build              Build React dashboard for production
  clean              Clean generated files and caches
  help               Show this help message

${YELLOW}Examples:${NC}
  ./run.sh                    # Start dashboard with existing data
  ./run.sh start-fresh        # Generate fresh data and start
  ./run.sh generate           # Only generate data
  ./run.sh analyze            # Analyze repository
  ./run.sh setup              # Setup project dependencies

${YELLOW}Options:${NC}
  --port PORT        Specify port for dashboard (default: 3000)
  --skip-install     Skip npm install during setup
  --verbose          Show verbose output

EOF
}

# Function to check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install Node.js and npm first."
        exit 1
    fi
}

# Function to check if Python is installed
check_python() {
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3 first."
        exit 1
    fi
}

# Function to setup the project
setup_project() {
    print_info "Setting up Identity-Online-Repo..."
    
    check_npm
    check_python
    
    # Install React dependencies
    print_info "Installing React dashboard dependencies..."
    cd "${PROJECT_ROOT}/react-dashboard"
    npm install
    cd "${PROJECT_ROOT}"
    
    # Verify config
    print_info "Verifying configuration..."
    python3 config.py
    
    print_success "Setup complete!"
}

# Function to generate all data
generate_data() {
    print_info "Generating all data..."
    
    check_python
    
    cd "${PROJECT_ROOT}"
    
    # Generate security data
    print_info "Generating security data..."
    python3 generate_security_data.py
    
    # Generate open source security data
    print_info "Generating open source security data..."
    python3 generate_opensource_security_data.py
    
    # Generate dependencies data
    if [ -f "generate_dependencies_data.py" ]; then
        print_info "Generating dependencies data..."
        python3 generate_dependencies_data.py
    fi
    
    # Generate technologies data
    if [ -f "generate_technologies_data.py" ]; then
        print_info "Generating technologies data..."
        python3 generate_technologies_data.py
    fi
    
    # Generate base images data
    if [ -f "generate_base_images_data.py" ]; then
        print_info "Generating base images data..."
        python3 generate_base_images_data.py
    fi
    
    # Generate sample data
    if [ -f "generate_sample_data.py" ]; then
        print_info "Generating sample data..."
        python3 generate_sample_data.py
    fi
    
    print_success "Data generation complete!"
}

# Function to analyze repository
analyze_repository() {
    print_info "Analyzing repository..."
    
    check_python
    
    cd "${PROJECT_ROOT}"
    python3 analyze_repository.py "$@"
    
    print_success "Analysis complete!"
}

# Function to start the dashboard
start_dashboard() {
    local port="${1:-3000}"
    
    print_info "Starting React dashboard on port ${port}..."
    
    check_npm
    
    cd "${PROJECT_ROOT}/react-dashboard"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_warning "Dependencies not installed. Running npm install..."
        npm install
    fi
    
    # Set port
    export PORT="${port}"
    
    print_success "Dashboard starting..."
    print_info "Open http://localhost:${port} in your browser"
    
    npm start
}

# Function to build for production
build_dashboard() {
    print_info "Building React dashboard for production..."
    
    check_npm
    
    cd "${PROJECT_ROOT}/react-dashboard"
    npm run build
    
    print_success "Build complete! Output in react-dashboard/build/"
}

# Function to run tests
run_tests() {
    print_info "Running tests..."
    
    check_npm
    
    cd "${PROJECT_ROOT}/react-dashboard"
    npm test
}

# Function to clean generated files
clean_project() {
    print_info "Cleaning generated files and caches..."
    
    cd "${PROJECT_ROOT}"
    
    # Clean data cache
    if [ -d "data/cache" ]; then
        rm -rf data/cache/*
        print_success "Cleaned data cache"
    fi
    
    # Clean React build
    if [ -d "react-dashboard/build" ]; then
        rm -rf react-dashboard/build
        print_success "Cleaned React build"
    fi
    
    # Clean Python cache
    find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    find . -type f -name "*.pyc" -delete 2>/dev/null || true
    print_success "Cleaned Python cache"
    
    print_success "Clean complete!"
}

# Main script logic
main() {
    local command="${1:-start}"
    shift || true
    
    case "$command" in
        start)
            start_dashboard "$@"
            ;;
        start-fresh)
            generate_data
            start_dashboard "$@"
            ;;
        generate)
            generate_data
            ;;
        analyze)
            analyze_repository "$@"
            ;;
        setup)
            setup_project
            ;;
        test)
            run_tests
            ;;
        build)
            build_dashboard
            ;;
        clean)
            clean_project
            ;;
        help|--help|-h)
            show_usage
            ;;
        *)
            print_error "Unknown command: $command"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
