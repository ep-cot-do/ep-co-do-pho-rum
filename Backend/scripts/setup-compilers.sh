#!/bin/bash

# FCoder Compiler Docker Setup Script
# This script pulls all necessary Docker images for the compiler system

echo "=== FCoder Compiler Docker Setup ==="
echo "Pulling Docker images for code compilation and execution..."

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed or not in PATH"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Error: Docker daemon is not running"
    echo "Please start Docker service"
    exit 1
fi

echo "✅ Docker is available"

# Array of images to pull
declare -a images=(
    "openjdk:17-alpine"
    "gcc:latest" 
    "python:3.11-alpine"
    "node:18-alpine"
)

# Pull each image
for image in "${images[@]}"; do
    echo ""
    echo "📦 Pulling $image..."
    if docker pull "$image"; then
        echo "✅ Successfully pulled $image"
    else
        echo "❌ Failed to pull $image"
        exit 1
    fi
done

echo ""
echo "=== Setup Complete ==="
echo "✅ All Docker images have been pulled successfully!"
echo ""

# Display pulled images
echo "📋 Available compiler images:"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep -E "(openjdk|gcc|python|node)"

echo ""
echo "🚀 The FCoder compiler system is ready to use!"
echo ""
echo "Test commands:"
echo "  Java:       docker run --rm openjdk:17-alpine java -version"
echo "  GCC:        docker run --rm gcc:latest gcc --version"  
echo "  Python:     docker run --rm python:3.11-alpine python --version"
echo "  Node.js:    docker run --rm node:18-alpine node --version"
