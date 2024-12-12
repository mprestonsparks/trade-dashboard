import { collectDefaultMetrics, Registry } from 'prom-client';
import { NextResponse } from 'next/server';

const register = new Registry();

// Add default metrics (memory usage, CPU usage, etc.)
collectDefaultMetrics({ register });

// Custom metrics
const pageViewCounter = new register.Counter({
    name: 'nextjs_page_views_total',
    help: 'Total number of page views',
    labelNames: ['page'],
});

const apiLatencyHistogram = new register.Histogram({
    name: 'nextjs_api_latency_seconds',
    help: 'Latency of API calls from the frontend',
    labelNames: ['endpoint'],
    buckets: [0.1, 0.5, 1, 2, 5],
});

const activeWebsocketConnections = new register.Gauge({
    name: 'nextjs_active_websocket_connections',
    help: 'Number of active WebSocket connections',
});

export async function GET() {
    try {
        const metrics = await register.metrics();
        return new NextResponse(metrics, {
            headers: {
                'Content-Type': register.contentType,
            },
        });
    } catch (error) {
        console.error('Error generating metrics:', error);
        return new NextResponse('Error generating metrics', { status: 500 });
    }
}
