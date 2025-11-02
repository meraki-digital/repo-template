#!/bin/bash
# Pre-push check: Build frontend and backend before pushing

set -e  # Exit on any error

echo "🔍 Running pre-push checks..."

# Check if we're pushing poc-dev or poc-prod
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "poc-dev" && "$BRANCH" != "poc-prod" ]]; then
  echo "✅ Not pushing to poc-dev/poc-prod, skipping build checks"
  exit 0
fi

echo "📦 Building frontend..."
cd poc/frontend
npm run build

echo "✅ Frontend build passed!"

# Backend check (optional - uncomment if you want to test backend)
# echo "📦 Checking backend..."
# cd ../backend
# python -m py_compile main.py

echo "✅ All checks passed! Safe to push."
