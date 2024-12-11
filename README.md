# Trade Dashboard

A Next.js application for visualizing and managing trade data. This is part of a microservices architecture that includes:
- Frontend Dashboard (port 3000)
- Trade Manager Service (port 8082)
- Market Analysis Service (port 8000)
- Trade Discovery Service (port 8084)

## Prerequisites

1. Docker and Docker Compose installed
2. Copy `.env.example` to `.env` and adjust values if needed:
```bash
cp .env.example .env
```

## Docker Deployment

The application runs as a set of microservices using Docker Compose:

## Docker Commands

### Start/Stop Services
```bash
# Build and start all services
docker compose up --build
```

```bash
# To run in detached mode
docker compose up --build -d
```

```bash
# To stop all services
docker compose down
```

### Manage Individual Containers
```bash
# Kill a specific container
docker kill <container_name>
```

```bash
# Kill all running containers
docker kill $(docker ps -q)
```

```bash
# Restart a specific container
docker restart <container_name>
```

```bash
# View running containers
docker ps
```

### Refresh/Rebuild Services
```bash
# Rebuild and restart all services
docker compose down && docker compose up --build -d
```

```bash
# Rebuild and restart a specific service
docker compose up --build -d <service_name>
```

The services will be available at:
- Frontend: http://localhost:3000
- Trade Manager: http://localhost:8082
- Market Analysis: http://localhost:8000
- Trade Discovery: http://localhost:8084

## Local Development

For local development without Docker:

```bash
npm install
npm run dev
```

Note: Running only the frontend locally will require the other services to be running separately.
