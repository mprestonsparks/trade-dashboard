'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TimeDisplay } from '@/components/ui/time-display'

interface HealthStatus {
  status: string
  message: string
  timestamp: string
}

export function MarketAnalysisStatus() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    status: 'unknown',
    message: 'Checking status...',
    timestamp: new Date().toISOString()
  })

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('http://localhost:8000/health')
        const data = await response.json()
        setHealthStatus(data)
      } catch (error) {
        setHealthStatus({
          status: 'error',
          message: 'Failed to connect to service',
          timestamp: new Date().toISOString()
        })
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Market Analysis</CardTitle>
          <CardDescription className="text-xs">Service Status</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <Badge
              variant={healthStatus.status === 'UP' || healthStatus.status === 'healthy' ? 'default' : 'destructive'}
              className="px-1 text-xs"
            >
              {healthStatus.status === 'UP' || healthStatus.status === 'healthy' ? 'Healthy' : 'Unhealthy'}
            </Badge>
            <TimeDisplay timestamp={healthStatus.timestamp} />
          </div>
          <p className="text-xs text-muted-foreground">{healthStatus.message}</p>
        </div>
      </CardContent>
    </Card>
  )
}