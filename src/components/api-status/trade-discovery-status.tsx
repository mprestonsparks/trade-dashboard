'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { RefreshCw, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TimeDisplay } from "../ui/time-display"

interface HealthStatus {
  status: string
  message: string
  timestamp: string
}

export function TradeDiscoveryStatus() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    status: 'unknown',
    message: 'Checking status...',
    timestamp: new Date().toISOString()
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isRestarting, setIsRestarting] = useState(false)

  const checkHealth = async () => {
    try {
      setIsRefreshing(true)
      const response = await fetch('http://localhost:8083/health')
      const data = await response.json()
      setHealthStatus(data)
    } catch (error) {
      setHealthStatus({
        status: 'error',
        message: 'Failed to connect to service',
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleRestart = async () => {
    try {
      setIsRestarting(true)
      await fetch('http://localhost:3000/api/docker/restart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          containerId: 'trade-dashboard-trade_discovery-1'
        })
      });
      checkHealth();
    } catch (error) {
      console.error('Failed to restart container:', error);
    } finally {
      setIsRestarting(false)
    }
  }

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Trade Discovery</CardTitle>
          <CardDescription className="text-xs">Service Status</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={checkHealth}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", { "animate-spin": isRefreshing })} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleRestart}
            disabled={isRestarting}
          >
            <Activity className={cn("h-4 w-4", { "animate-spin": isRestarting })} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <Badge
              variant={healthStatus.status === 'UP' ? 'default' : 'destructive'}
              className="px-1 text-xs"
            >
              {healthStatus.status === 'UP' ? 'Healthy' : 'Unhealthy'}
            </Badge>
            <TimeDisplay timestamp={healthStatus.timestamp} />
          </div>
          <p className="text-xs text-muted-foreground">{healthStatus.message}</p>
        </div>
      </CardContent>
    </Card>
  )
}
