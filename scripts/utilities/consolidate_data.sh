#!/bin/bash
#
# Data Consolidation Script
# 
# This script consolidates all data files from multiple locations into a single
# /data/generated/ directory and creates symlinks for backward compatibility.
#

set -e

echo "========================================="
echo "Data Consolidation Script"
echo "========================================="
echo ""

# Define directories
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_GENERATED="${PROJECT_ROOT}/data/generated"
OUTPUT_DIR="${PROJECT_ROOT}/output"
REACT_PUBLIC_DATA="${PROJECT_ROOT}/react-dashboard/public/data"
REACT_SRC_DATA="${PROJECT_ROOT}/react-dashboard/src/data"

# Ensure target directory exists
mkdir -p "${DATA_GENERATED}"

echo "Step 1: Consolidating data files..."
echo "-----------------------------------"

# List of data files to consolidate
DATA_FILES=(
    "microservices_inventory.json"
    "repo_activity_summary.json"
    "image_inventory.json"
    "dependencies_data.json"
    "technologies_data.json"
    "base_images_data.json"
    "security_findings.json"
    "opensource_security.json"
    "package_data.json"
)

# Copy the most recent version of each file to /data/generated/
for file in "${DATA_FILES[@]}"; do
    echo "Processing: $file"
    
    # Find the most recently modified version
    MOST_RECENT=""
    MOST_RECENT_TIME=0
    
    # Check each location
    for dir in "${OUTPUT_DIR}" "${REACT_PUBLIC_DATA}" "${REACT_SRC_DATA}" "${PROJECT_ROOT}/data"; do
        if [ -f "${dir}/${file}" ]; then
            FILE_TIME=$(stat -f %m "${dir}/${file}" 2>/dev/null || echo 0)
            if [ "$FILE_TIME" -gt "$MOST_RECENT_TIME" ]; then
                MOST_RECENT="${dir}/${file}"
                MOST_RECENT_TIME=$FILE_TIME
            fi
        fi
    done
    
    # Copy the most recent version
    if [ -n "$MOST_RECENT" ]; then
        cp "$MOST_RECENT" "${DATA_GENERATED}/${file}"
        echo "  ✓ Copied from: $MOST_RECENT"
    else
        echo "  ⚠ File not found in any location"
    fi
done

echo ""
echo "Step 2: Creating symlinks for backward compatibility..."
echo "-------------------------------------------------------"

# Create symlink in /output/ pointing to /data/generated/
if [ -d "${OUTPUT_DIR}" ]; then
    echo "Backing up /output/ directory..."
    if [ ! -d "${OUTPUT_DIR}.backup" ]; then
        cp -r "${OUTPUT_DIR}" "${OUTPUT_DIR}.backup"
        echo "  ✓ Backup created: ${OUTPUT_DIR}.backup"
    fi
fi

# Create symlink in React public data
echo "Creating symlink: react-dashboard/public/data -> ../../data/generated"
rm -rf "${REACT_PUBLIC_DATA}"
ln -s "../../data/generated" "${REACT_PUBLIC_DATA}"
echo "  ✓ Symlink created"

# Clean up React src data (no longer needed)
if [ -d "${REACT_SRC_DATA}" ]; then
    echo "Removing: react-dashboard/src/data (no longer needed)"
    rm -rf "${REACT_SRC_DATA}"
    echo "  ✓ Removed"
fi

echo ""
echo "Step 3: Verifying consolidation..."
echo "-----------------------------------"

# Count files in /data/generated/
FILE_COUNT=$(ls -1 "${DATA_GENERATED}"/*.json 2>/dev/null | wc -l | tr -d ' ')
echo "Files in /data/generated/: $FILE_COUNT"

# Verify symlink
if [ -L "${REACT_PUBLIC_DATA}" ]; then
    echo "  ✓ Symlink verified: react-dashboard/public/data"
else
    echo "  ✗ Symlink missing: react-dashboard/public/data"
fi

echo ""
echo "========================================="
echo "Data Consolidation Complete!"
echo "========================================="
echo ""
echo "Summary:"
echo "  - Data files consolidated to: /data/generated/"
echo "  - Symlink created: react-dashboard/public/data -> ../../data/generated"
echo "  - Old /output/ backed up to: /output.backup"
echo "  - React src/data removed (no longer needed)"
echo ""
echo "Next steps:"
echo "  1. Update all generation scripts to use /data/generated/"
echo "  2. Test the React dashboard"
echo "  3. Remove backup directories after verification"
echo ""
