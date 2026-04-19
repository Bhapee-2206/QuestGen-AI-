FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from the sub-folder
COPY ai-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all files from the sub-folder into the container
COPY ai-service/ .

# Expose port
EXPOSE 8000

# Start application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
