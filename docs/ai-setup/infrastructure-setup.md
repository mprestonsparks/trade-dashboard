## Infrastructure Setup
This document describes how to set up the development environment for all three microservices and the frontend.
### Prerequisites
- Docker and Docker Compose installed.
- Access to the GitHub repositories:
  - `market-analysis`
  - `trade-manager`
  - `trade-discovery`
- A running instance of Redis and RabbitMQ (via Docker Compose).
- PostgreSQL (for Trade Discovery) either via Docker or an external host.
### Steps
1. **Clone Repositories**
   ```bash
   git clone https://github.com/mprestonsparks/market-analysis.git
   git clone https://github.com/mprestonsparks/trade-manager.git
   git clone https://github.com/mprestonsparks/trade-discovery.git
```
2. **Directory Structure** Organize as:
   - project-root
	   - /market-analysis
	   - /trade-manager
	   - /trade-discovery
	   - /frontend
	   - docker-compose.yml
3. **Shared Docker Compose** Create a `docker-compose.yml` at `project-root` to run Redis, RabbitMQ, and (optionally) PostgreSQL (for `trade-discovery`):
   ``` yaml
version: '3.9'
services:
  redis:
    image: redis:latest
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: trade_discovery
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
```
4. **Service Configuration**
- **Market Analysis**:
    - Expects environment variables for Redis and RabbitMQ.
- **Trade Manager**:
    - Expects Redis, RabbitMQ, and configuration parameters for the Active Inference and GA systems.
- **Trade Discovery**:
    - Expects Redis, RabbitMQ, and PostgreSQL configuration.
    - Environment variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`.
5. **Local Development**
``` bash
docker-compose up -d  # Start redis, rabbitmq, postgres
```
6. **Verification**
- Confirm Market Analysis: `http://localhost:8001`
- Confirm Trade Manager: `http://localhost:8002`
- Confirm Trade Discovery: `http://localhost:8003`
- Redis: `localhost:6379`
- RabbitMQ management: `http://localhost:15672`
- PostgreSQL: `localhost:5432` (for trade-discovery persistence)
This setup provides the foundation for local integration, testing, and development. You can refine and extend as the project evolves.
