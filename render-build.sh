#!/bin/bash
# Render.com build script for combined deployment

set -e # Exit on error

echo "==> Building client..."
cd client
npm ci --include=dev
npm run build
echo "✓ Client built successfully"
cd ..

echo "==> Installing server dependencies..."
cd server
npm ci
echo "✓ Server dependencies installed"
cd ..

echo "==> Build complete!"
