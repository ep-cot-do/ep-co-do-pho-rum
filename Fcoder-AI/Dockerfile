# Use official Python runtime as base image
FROM python:3.10-slim

# Set working directory in container
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /app/venv

# Copy project files
COPY requirements.txt .
COPY . .

# Activate virtual environment and install dependencies
RUN /app/venv/bin/pip install --no-cache-dir -r requirements.txt

# Expose port the app runs on
EXPOSE 9090

# Create a non-root user for security
RUN addgroup --system appuser && adduser --system --group appuser
USER appuser

# Use docker-compose for environment variables
CMD ["/app/venv/bin/uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "9090"]
