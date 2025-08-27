@echo off
REM FCoder Compiler Docker Setup Script for Windows
REM This script pulls all necessary Docker images for the compiler system

echo === FCoder Compiler Docker Setup ===
echo Pulling Docker images for code compilation and execution...

REM Check if Docker is installed and running
docker --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Error: Docker is not installed or not in PATH
    echo Please install Docker Desktop: https://docs.docker.com/desktop/windows/
    pause
    exit /b 1
)

docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Error: Docker daemon is not running
    echo Please start Docker Desktop
    pause
    exit /b 1
)

echo ✅ Docker is available

REM Pull each image
echo.
echo 📦 Pulling openjdk:17-alpine...
docker pull openjdk:17-alpine
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to pull openjdk:17-alpine
    pause
    exit /b 1
)
echo ✅ Successfully pulled openjdk:17-alpine

echo.
echo 📦 Pulling gcc:latest...
docker pull gcc:latest
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to pull gcc:latest
    pause
    exit /b 1
)
echo ✅ Successfully pulled gcc:latest

echo.
echo 📦 Pulling python:3.11-alpine...
docker pull python:3.11-alpine
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to pull python:3.11-alpine
    pause
    exit /b 1
)
echo ✅ Successfully pulled python:3.11-alpine

echo.
echo 📦 Pulling node:18-alpine...
docker pull node:18-alpine
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to pull node:18-alpine
    pause
    exit /b 1
)
echo ✅ Successfully pulled node:18-alpine

echo.
echo === Setup Complete ===
echo ✅ All Docker images have been pulled successfully!
echo.

REM Display pulled images
echo 📋 Available compiler images:
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | findstr /R "openjdk gcc python node"

echo.
echo 🚀 The FCoder compiler system is ready to use!
echo.
echo Test commands:
echo   Java:       docker run --rm openjdk:17-alpine java -version
echo   GCC:        docker run --rm gcc:latest gcc --version
echo   Python:     docker run --rm python:3.11-alpine python --version
echo   Node.js:    docker run --rm node:18-alpine node --version
echo.
pause
