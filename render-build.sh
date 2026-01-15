#!/bin/bash
# Render.com build script for combined deployment

set -e # Exit on error

echo "==> Building client..."
cd client
echo "Installing client dependencies (including dev dependencies for build tools)..."
npm ci --include=dev
echo "Building React app..."
npm run build
echo "✓ Client built successfully"
cd ..

echo "==> Installing server dependencies..."
cd server
echo "Installing production dependencies..."
npm ci --only=production
echo "✓ Server dependencies installed"
cd ..

echo "==> Build complete!"
ls -la client/dist
