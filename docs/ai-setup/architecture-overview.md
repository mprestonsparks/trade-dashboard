## Architecture Overview
This document presents the high-level architecture for the trading system composed of three FastAPI-based microservices, each integrating with Redis, RabbitMQ, and a frontend UI built using ShadCN and Next.js. The three core services are:
1. **Market Analysis Service** (`market-analysis`)
   - Identifies evolving market states using PCA and clustering.
   - Dynamically adjusts technical indicators (e.g., RSI, MACD, Stochastic) based on identified states.
   - Provides adaptive trading signals and state classifications for other services.
2. **Trade Manager Service** (`trade-manager`)
   - Implements a holistic trading decision framework using Active Inference and Genetic Algorithms.
   - Maintains and updates "market beliefs" and optimizes trade execution, risk management, and portfolio allocation parameters simultaneously.
   - Integrates with broker adapters (e.g., Interactive Brokers) and manages system state, position sizing, and risk.
3. **Trade Discovery Service** (`trade-discovery`)
   - Automates the discovery and ranking of trading opportunities across a large pool of assets.
   - Integrates with the Market Analysis Service to feed state-aware signals into its evaluation.
   - Integrates with the Trade Manager Service’s Active Inference and GA frameworks to identify high-quality, risk-adjusted opportunities.
   - Stores and provides opportunities, rankings, and related metrics via an API.
**Common Dependencies:**
- **Redis:** Used for caching and lightweight state storage across services.
- **RabbitMQ:** Used for asynchronous message passing, enabling decoupled communication between services.
- **PostgreSQL (in Trade Discovery):** Used as a persistent store for discovered opportunities, historical performance, and asset pool configurations.
**Frontend UI:**
- Built with **Next.js** and **ShadCN UI** components.
- Serves as a command center for monitoring market states, discovered opportunities, current trades, and system configuration parameters.
- Allows customization of trading parameters (e.g., Active Inference settings, GA evolution parameters, PCA thresholds, indicator sensitivity) through a user-friendly interface.
- Visualizes states, signals, risk metrics, portfolio composition, and discovered opportunities in a clear, adaptive, and user-configurable manner.
