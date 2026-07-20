FROM python:3.11-slim

WORKDIR /app

# Prevent python from writing pyc files and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Azure App Service passes PORT via environment variable (defaults to 8000)
ENV PORT=8000
EXPOSE 8000

# Make startup script executable
RUN chmod +x startup.sh

# Run startup script or uvicorn directly
CMD ["sh", "startup.sh"]
