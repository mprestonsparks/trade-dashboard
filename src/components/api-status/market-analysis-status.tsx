'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TimeDisplay } from '@/components/ui/time-display'
import { Button } from '@/components/ui/button'
import { RefreshCw, Activity, Database, MessageSquare } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DependencyStatus {
  connected: boolean
  latency_ms?: number
  error?: string
  last_successful_connection?: string
}

interface SystemMetrics {
  cpu_usage: number
  memory_usage: number
  uptime_seconds: number
  request_count: number
  average_response_time_ms: number
}

interface HealthStatus {
  status: string
  version: string
  environment: string
  timestamp: string
  git_commit?: string
  dependencies: {
    redis: DependencyStatus
    rabbitmq: DependencyStatus
  }
  metrics: SystemMetrics
}

function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)
  
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function DependencyBadge({ name, status }: { name: string, status: DependencyStatus }) {
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={status.connected ? "default" : "destructive"}
        className="px-1 text-xs"
      >
        {name}
      </Badge>
      {status.connected && status.latency_ms && (
        <span className="text-xs text-muted-foreground">
          {status.latency_ms.toFixed(1)}ms
        </span>
      )}
    </div>
  )
}

export function MarketAnalysisStatus() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    status: 'unknown',
    version: '',
    environment: '',
    timestamp: new Date().toISOString(),
    dependencies: {
      redis: { connected: false },
      rabbitmq: { connected: false }
    },
    metrics: {
      cpu_usage: 0,
      memory_usage: 0,
      uptime_seconds: 0,
      request_count: 0,
      average_response_time_ms: 0
    }
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isRestarting, setIsRestarting] = useState(false)
  const [mounted, setMounted] = useState(false)

  const checkHealth = async () => {
    console.log('[MarketAnalysisStatus] Checking health...')
    try {
      setIsRefreshing(true)
      console.log('[MarketAnalysisStatus] Fetching health from http://localhost:8000/health')
      const response = await fetch('http://localhost:8000/health')
      console.log('[MarketAnalysisStatus] Health response status:', response.status)
      
      const data = await response.json()
      console.log('[MarketAnalysisStatus] Health data:', data)
      setHealthStatus(data)
    } catch (error) {
      console.error('[MarketAnalysisStatus] Health check failed:', error)
      setHealthStatus(prev => {
        const newStatus = {
          ...prev,
          status: 'error',
          timestamp: new Date().toISOString()
        }
        console.log('[MarketAnalysisStatus] Updated health status:', newStatus)
        return newStatus
      })
    } finally {
      console.log('[MarketAnalysisStatus] Health check completed')
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    console.log('[MarketAnalysisStatus] Component mounted, initializing...')
    setMounted(true)
    
    // Test if the health endpoint is reachable
    fetch('http://localhost:8000/health', { method: 'HEAD' })
      .then(() => console.log('[MarketAnalysisStatus] Health endpoint is reachable'))
      .catch(err => console.error('[MarketAnalysisStatus] Health endpoint is NOT reachable:', err))

    checkHealth()
    console.log('[MarketAnalysisStatus] Setting up health check interval (30s)')
    const interval = setInterval(checkHealth, 30000)
    return () => {
      console.log('[MarketAnalysisStatus] Cleaning up health check interval')
      clearInterval(interval)
    }
  }, [])

  const handleRestart = async () => {
    if (!mounted) return;
    
    try {
      console.log('Restart button clicked');
      setIsRestarting(true);
      
      const serviceId = process.env.NEXT_PUBLIC_DOCKER_MARKET_ANALYSIS_SERVICE;
      console.log('Service ID:', serviceId);
      
      const response = await fetch('/api/docker/restart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          containerId: serviceId
        })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.details || 'Failed to restart service');
      }
      
      const responseData = await response.json();
      console.log('Success response:', responseData);
      
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

  if (!mounted) {
    console.log('[MarketAnalysisStatus] Component not yet mounted, showing loading state')
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Market Analysis</CardTitle>
            <CardDescription className="text-xs">Loading...</CardDescription>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Market Analysis</CardTitle>
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Button clicked directly');
                    handleRestart();
                  }}
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge
              variant={
                healthStatus.status === 'healthy' 
                  ? 'default' 
                  : healthStatus.status === 'degraded'
                    ? 'warning'
                    : 'destructive'
              }
              className="px-1 text-xs"
            >
              {healthStatus.status === 'healthy' 
                ? 'Healthy' 
                : healthStatus.status === 'degraded'
                  ? 'Degraded'
                  : 'Unhealthy'}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Version</span>
              <span>{healthStatus.version}</span>
            </div>
            {healthStatus.git_commit && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Commit</span>
                <span>{healthStatus.git_commit}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Environment</span>
              <span>{healthStatus.environment}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Last Updated</span>
              <TimeDisplay timestamp={healthStatus.timestamp} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Dependencies</span>
            </div>
            <div className="flex flex-col gap-1">
              <DependencyBadge name="Redis" status={healthStatus.dependencies.redis} />
              <DependencyBadge name="RabbitMQ" status={healthStatus.dependencies.rabbitmq} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">System Metrics</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">CPU Usage</span>
                <span>{healthStatus.metrics.cpu_usage.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Memory</span>
                <span>{healthStatus.metrics.memory_usage.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Uptime</span>
                <span>{formatDuration(healthStatus.metrics.uptime_seconds)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Requests</span>
                <span>{healthStatus.metrics.request_count}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
