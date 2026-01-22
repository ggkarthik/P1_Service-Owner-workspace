#!/bin/bash

# Script to push the Service Owner Workspace to GitHub
# This script should be run after creating the GitHub repository

echo "=========================================="
echo "Push Service Owner Workspace to GitHub"
echo "=========================================="
echo ""

# Get the GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

# Repository name
REPO_NAME="Service-Owner-workspace"

echo ""
echo "Setting up remote repository..."
git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo "Checking current branch..."
CURRENT_BRANCH=$(git branch --show-current)

if [ -z "$CURRENT_BRANCH" ]; then
    echo "Creating main branch..."
    git branch -M main
    CURRENT_BRANCH="main"
fi

echo "Current branch: $CURRENT_BRANCH"

echo ""
echo "Pushing to GitHub..."
git push -u origin $CURRENT_BRANCH

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Successfully pushed to GitHub!"
    echo ""
    echo "Your repository is now available at:"
    echo "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
    echo ""
    echo "Next steps:"
    echo "1. Visit your repository on GitHub"
    echo "2. Configure GitHub Pages (optional) under Settings > Pages"
    echo "3. Set up CI/CD workflows if needed"
    echo "4. Invite collaborators if working in a team"
else
    echo ""
    echo "✗ Push failed. Please check your credentials and try again."
    echo ""
    echo "If the repository doesn't exist, create it first:"
    echo "https://github.com/new"
    echo ""
    echo "Repository name: ${REPO_NAME}"
    echo "Description: A comprehensive dashboard for managing and monitoring microservices architecture"
    echo "Visibility: Public"
    echo "Do NOT initialize with README, .gitignore, or license"
fi
