'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { RefreshCw, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TimeDisplay } from "../ui/time-display"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HealthStatus {
  status: string
  message: string
  timestamp: string
}

export function TradeManagerStatus() {
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
      const response = await fetch('http://localhost:8082/health')
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
      const response = await fetch('/api/docker/restart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          containerId: process.env.NEXT_PUBLIC_DOCKER_TRADE_MANAGER_SERVICE
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ details: 'Network error occurred' }));
        throw new Error(errorData.details || 'Failed to restart service');
      }
      
      // Wait a bit before checking health to allow the service to start
      await new Promise(resolve => setTimeout(resolve, 5000));
      await checkHealth();
    } catch (error) {
      console.error('Failed to restart container:', error);
      setHealthStatus(prev => ({
        ...prev,
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to restart service',
        timestamp: new Date().toISOString()
      }));
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
          <CardTitle className="text-sm font-medium">Trade Manager</CardTitle>
          <CardDescription className="text-xs">Service Status</CardDescription>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={checkHealth}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={cn("h-4 w-4", { "animate-spin": isRefreshing })} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh Status</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleRestart}
                  disabled={isRestarting}
                >
                  <Activity className={cn("h-4 w-4", { "animate-spin": isRestarting })} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Restart Service</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
