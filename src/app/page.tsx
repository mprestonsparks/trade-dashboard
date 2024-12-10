'use client'

import { MarketAnalysisStatus } from "@/components/api-status/market-analysis-status"
import { TradeManagerStatus } from "@/components/api-status/trade-manager-status"
import { TradeDiscoveryStatus } from "@/components/api-status/trade-discovery-status"

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">API Status</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MarketAnalysisStatus />
        <TradeManagerStatus />
        <TradeDiscoveryStatus />
      </div>
      <div className="grid gap-4">
        {/* Additional content sections will go here */}
      </div>
    </div>
  )
}