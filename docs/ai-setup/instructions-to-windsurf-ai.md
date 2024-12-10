## Instructions to Windsurf AI

**Objective:**
Set up a system of three microservices — Market Analysis, Trade Manager, and Trade Discovery — each using FastAPI, Redis, and RabbitMQ, with the Trade Discovery service also using PostgreSQL. 
Integrate a Next.js + ShadCN UI frontend that interacts with all three backends. 
The UI should allow configuration of each system’s parameters, reflecting their adaptive complexity.
**Instructions:**
1. **Clone & Setup Repos**
   - Follow `infrastructure-setup.md` to clone repos and run the necessary infrastructure services (Redis, RabbitMQ, Postgres).
   - Ensure all environment variables are set correctly for each service.
2. **Adopt Project Structures**
   - Standardize code structures as per `fastapi-structure.md`.
   - Implement environment-driven configs (REDIS_URL, RABBITMQ_URL, DB configs) in each service.
3. **Integrate Features**
   - **Market Analysis**: Ensure endpoints serve PCA-based state info, adaptive indicators, and signals.
   - **Trade Manager**: Provide endpoints to query and update Active Inference parameters, GA population sizes, and retrieve portfolio/trade states.
   - **Trade Discovery**: Integrate with Market Analysis and Trade Manager. Implement endpoints to retrieve discovered opportunities, asset pool info, and performance metrics. Use the DB schema suggested in the README.
4. **Frontend Development**
   - Follow `frontend-setup.md`.
   - Implement pages that allow configuration of indicators (from Market Analysis), Active Inference/GA parameters (from Trade Manager), and filtering/ranking criteria for discovered opportunities (from Trade Discovery).
   - Use ShadCN UI components to provide a polished, flexible, and user-friendly experience.
5. **Verification**
   - Run all services locally. Check that Market Analysis, Trade Manager, and Trade Discovery endpoints return expected data.
   - Ensure the frontend can fetch data from all endpoints.
   - Verify that changing parameters in the UI updates the backend configuration (via POST/PUT requests to relevant endpoints).
6. **Iterate and Improve**
   - Once the baseline integration is complete, enhance the UI with visualizations (charts for market states, tables for opportunities, forms for parameter configuration).
   - Explore CI/CD setup with automated tests and deployments as per `ci-cd-pipeline.md`.
**Goal:**
A functional, cohesive environment where:
- Market Analysis continuously provides state-aware signals.
- Trade Manager uses Active Inference and GA to optimize trading decisions.
- Trade Discovery identifies and ranks opportunities.
- The UI allows users to view data, configure parameters, and make informed decisions in real-time.

