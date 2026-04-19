# --- Stage 1: Build Frontend ---
FROM node:18-slim AS frontend-builder
WORKDIR /build-fe
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
# This creates the "dist" folder
RUN npm run build

# --- Stage 2: Final Backend Image ---
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY ai-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY ai-service/ .

# Copy built frontend from Stage 1 to a folder named "static"
# FastAPI will serve this directory
COPY --from=frontend-builder /build-fe/dist ./static

EXPOSE 8000

# Start the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
