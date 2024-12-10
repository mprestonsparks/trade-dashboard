## Frontend Setup (Next.js + ShadCN UI) 
The frontend provides a unified interface for monitoring market states, reviewing discovered opportunities, configuring the Trade Manager’s inference and GA parameters, and visualizing ongoing trades and performance metrics. 
## Steps 
1. **Initialize Frontend Project** 
``` bash
npx create-next-app frontend
cd frontend
```
2. **Install Tailwind & ShadCN UI**
``` bash
npm install tailwindcss postcss autoprefixer @shadcn/ui
npx tailwindcss init -p
npx shadcn-ui init
```
3. **Environment Variables** In `.env.local`:
``` 
NEXT_PUBLIC_MARKET_ANALYSIS_URL=http://localhost:8001
NEXT_PUBLIC_TRADE_MANAGER_URL=http://localhost:8002
NEXT_PUBLIC_TRADE_DISCOVERY_URL=http://localhost:8003
```
4. **UI Features**
- **Market Dashboard**: Visualize market states (PCA clusters, volatility), signals, and indicators.
- **Trade Manager Console**: Display current portfolio, open positions, risk metrics, and allow parameter configuration (e.g., GA population size, Active Inference parameters).
- **Trade Discovery Panel**: Show discovered opportunities, with filters by score, market state, and risk level. Allow customization of scoring and filtering criteria.
- **Customization & Configuration Pages**: Let users adjust thresholds, state sensitivity, Active Inference learning rates, GA mutation rates, and other key parameters via UI controls.
5. **Fetching Data in Next.js**
``` javascript
async function getMarketData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_MARKET_ANALYSIS_URL}/api/market_state`);
  return res.json();
}

export default async function MarketPage() {
  const data = await getMarketData();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Market Analysis Dashboard</h1>
      {/* Render PCA states, signals, and more */}
    </div>
  );
}
```
6. Design Considerations**
- Use ShadCN components (e.g., buttons, sliders, input fields) to let the user tweak system parameters.
- Visualize time-series data (market states, signals) via charts (e.g., using a React chart library).
- Display discovered opportunities in sortable tables with filters and search functions.
- Provide forms for user-defined configuration, which can be POSTed back to the microservices to update runtime parameters.
By providing a dynamic, user-configurable UI, stakeholders can experiment with system parameters and quickly see the impact on opportunities, trades, and performance.
