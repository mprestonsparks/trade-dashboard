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

  const checkHealth = async () => {
    try {
      setIsRefreshing(true)
      const response = await fetch('http://localhost:8000/health')
      const data = await response.json()
      setHealthStatus(data)
    } catch (error) {
      setHealthStatus(prev => ({
        ...prev,
        status: 'error',
        timestamp: new Date().toISOString()
      }))
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleRestart = async () => {
    try {
      setIsRestarting(true)
      await fetch('http://localhost:8000/docker/restart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          containerId: 'trade-dashboard-market_analysis-1'
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

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Database className="h-4 w-4" />
              <span>Dependencies</span>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <DependencyBadge name="Redis" status={healthStatus.dependencies.redis} />
                {healthStatus.dependencies.redis.error && (
                  <span className="text-xs text-destructive ml-2" title={healthStatus.dependencies.redis.error}>
                    Error
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <DependencyBadge name="RabbitMQ" status={healthStatus.dependencies.rabbitmq} />
                {healthStatus.dependencies.rabbitmq.error && (
                  <span className="text-xs text-destructive ml-2" title={healthStatus.dependencies.rabbitmq.error}>
                    Error
                  </span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Metrics</span>
            </div>
            <div className="grid gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Uptime</span>
                <span>{formatDuration(healthStatus.metrics.uptime_seconds)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">CPU Usage</span>
                <span>{healthStatus.metrics.cpu_usage.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Memory</span>
                <span>{healthStatus.metrics.memory_usage.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Requests</span>
                <span>{healthStatus.metrics.request_count}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Avg Response</span>
                <span>{healthStatus.metrics.average_response_time_ms.toFixed(1)}ms</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
