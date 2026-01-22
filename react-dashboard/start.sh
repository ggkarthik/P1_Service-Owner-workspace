#!/bin/bash

# RiskLens - Quick Start Script
# This script starts the development server

echo "🚀 Starting RiskLens Platform..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if data files exist
if [ ! -f "../data/microservices_inventory.json" ]; then
    echo "⚠️  Warning: Data files not found. Dashboard may not display correctly."
    echo "   Run the data generation scripts to create sample data."
    echo ""
fi

echo "🌐 Starting development server..."
echo ""
echo "   Landing Page: http://localhost:3000"
echo "   Login Page:   http://localhost:3000/login"
echo "   Dashboard:    http://localhost:3000/dashboard"
echo ""
echo "   Demo Credentials:"
echo "   Email:    demo@risklens.com"
echo "   Password: demo123"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
