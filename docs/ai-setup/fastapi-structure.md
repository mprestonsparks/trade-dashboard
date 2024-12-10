## FastAPI Project Structure  
All microservices follow a similar structure for consistency. Adapt as needed.
**Service-Specific Notes:**
- **Market Analysis**: `services/analysis.py` might handle PCA and state classification. Indicator configs could be in `config/technical_indicators.py`.
- **Trade Manager**: `services/trade_engine.py` or `core/trading_session.py` orchestrates Active Inference and GA. `system_state.py` manages state. 
- **Trade Discovery**: `services/discovery.py` orchestrates integration with Market Analysis and Trade Manager, `services/integration.py` handles API calls to them, `services/analysis.py` might rank opportunities.
This consistent structure ensures each team member can navigate the codebases easily.