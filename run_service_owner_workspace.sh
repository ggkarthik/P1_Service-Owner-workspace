#!/bin/bash

# Service Owner Workspace Runner
# This script generates fresh service owner data and launches the React dashboard

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         Service Owner Workspace Dashboard                      ║"
echo "║         AI-Native Security Risk Management                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "${BLUE}Step 1: Generating fresh service owner data...${NC}"
python3 "$SCRIPT_DIR/generate_service_owner_data.py"

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Warning: Failed to generate fresh data. Using existing data.${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Copying data to React dashboard...${NC}"
cp "$SCRIPT_DIR/data/generated/service_owner_data.json" "$SCRIPT_DIR/react-dashboard/public/data/" 2>/dev/null || true

echo ""
echo -e "${BLUE}Step 3: Starting React dashboard...${NC}"
cd "$SCRIPT_DIR/react-dashboard"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

echo ""
echo -e "${GREEN}✓ Dashboard starting...${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Service Owner Workspace will open at: http://localhost:3000"
echo "  Navigate to: Dashboard → Microservices"
echo "  Then click on any service card to view its Service Owner Dashboard"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}Features:${NC}"
echo "  • Interactive Service Cards: Click any microservice to view its risk dashboard"
echo "  • High-Level View: Risk scores, trends, and AI insights"
echo "  • Granular View: Detailed vulnerability table with filtering"
echo "  • AI Copilot: Conversational interface for Q&A"
echo "  • Seamless Integration: Service Owner view directly in the Microservices tab"
echo ""
echo "Press Ctrl+C to stop the dashboard"
echo ""

npm start
