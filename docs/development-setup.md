# Development Setup Guide

This guide explains how to set up and run the Trading Dashboard system and its related services for development.

## Prerequisites

- Docker and Docker Compose
- Node.js (v20 or later)
- Git

## Project Structure

The Trading Dashboard is part of a microservices architecture that includes:

- `trade-dashboard`: Frontend UI and service orchestration
- `market-analysis`: Market analysis service
- `trade-manager`: Trade management service
- `trade-discovery`: Trade discovery service

## Environment Configuration

The project uses environment variables for configuration. These are managed through `.env` files.

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Configure the following sections in your `.env` file:

### Docker Services
```env
DOCKER_FRONTEND_SERVICE=trading-dashboard-frontend
DOCKER_MARKET_ANALYSIS_SERVICE=trading-market-analysis
DOCKER_TRADE_MANAGER_SERVICE=trading-trade-manager
DOCKER_TRADE_DISCOVERY_SERVICE=trading-trade-discovery
```

### Service Ports
```env
FRONTEND_PORT=3000
MARKET_ANALYSIS_PORT=8000
TRADE_MANAGER_PORT=8082
TRADE_DISCOVERY_PORT=8084
```

### API Configuration
```env
API_BASE_URL=/api
NEXT_PUBLIC_API_BASE_URL=/api
API_HOST=0.0.0.0
NEXT_PUBLIC_API_HOST=localhost
```

### Docker Configuration
```env
DOCKER_NETWORK_NAME=trading_system_net
DOCKER_HOST=unix:///var/run/docker.sock
```

### Project Paths
```env
MARKET_ANALYSIS_PATH=../market-analysis
TRADE_MANAGER_PATH=../trade-manager
TRADE_DISCOVERY_PATH=../trade-discovery
```

### Development Settings
```env
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
WATCHPACK_POLLING=true
CHOKIDAR_USEPOLLING=true
```

### Python Settings
```env
PYTHONPATH=/app
```

## Getting Started

1. Clone all required repositories:
   ```bash
   git clone https://github.com/yourusername/trade-dashboard.git
   git clone https://github.com/yourusername/market-analysis.git
   git clone https://github.com/yourusername/trade-manager.git
   git clone https://github.com/yourusername/trade-discovery.git
   ```

2. Ensure all repositories are in the same parent directory:
   ```
   parent-directory/
   ├── trade-dashboard/
   ├── market-analysis/
   ├── trade-manager/
   └── trade-discovery/
   ```

3. Navigate to the trade-dashboard directory:
   ```bash
   cd trade-dashboard
   ```

4. Start all services:
   ```bash
   docker-compose up --build
   ```

## Service URLs

After starting the services, they will be available at:

- Frontend UI: http://localhost:3000
- Market Analysis API: http://localhost:8000
- Trade Manager API: http://localhost:8082
- Trade Discovery API: http://localhost:8084

## Development Workflow

1. **UI Development**: The frontend runs in development mode with hot reloading enabled. Changes to the code will automatically refresh the browser.

2. **API Development**: All API services are configured with hot reloading. Changes to Python files will automatically restart the respective service.

3. **Service Management**: The UI includes a service management panel where you can:
   - Monitor service health
   - Restart individual services
   - View service logs

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Error: "port is already allocated"
   - Solution: Check for other services using the same ports and stop them, or modify the port numbers in your `.env` file

2. **Docker Socket Access**
   - Error: "permission denied while trying to connect to the Docker daemon socket"
   - Solution: Ensure your user has proper permissions to access the Docker socket

3. **Network Issues**
   - Error: "network trading_system_net not found"
   - Solution: Run `docker-compose down` and then `docker-compose up --build` to recreate the network

### Logs

To view logs for specific services:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs [service-name]

# Follow logs
docker-compose logs -f [service-name]
```

## Contributing

1. Create a new branch for your feature/fix
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
