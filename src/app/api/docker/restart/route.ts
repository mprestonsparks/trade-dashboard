import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

// Helper function to get the project root directory
function getProjectRoot() {
  // Get the absolute path to the project root
  return process.cwd();
}

// Validate service name to prevent command injection
function isValidServiceName(serviceName: string): boolean {
  const validServices = [
    process.env.DOCKER_TRADE_MANAGER_SERVICE,
    process.env.DOCKER_MARKET_ANALYSIS_SERVICE,
    process.env.DOCKER_FRONTEND_SERVICE
  ];
  return validServices.includes(serviceName);
}

export async function POST(req: NextRequest) {
  console.log('[Docker Restart API] Received restart request')
  
  try {
    const body = await req.json();
    const { containerId } = body;
    console.log('[Docker Restart API] Container ID:', containerId)

    // Validate service name for security
    if (!isValidServiceName(containerId)) {
      console.error('[Docker Restart API] Invalid service name:', containerId);
      return NextResponse.json({ 
        error: 'Invalid service name',
        details: 'The specified service is not recognized'
      }, { status: 400 });
    }

    // Build the docker compose command
    const projectName = 'trade-dashboard';
    const command = `docker compose -p ${projectName} restart ${containerId}`;
    console.log('[Docker Restart API] Executing command:', command)

    try {
      const { stdout, stderr } = await execAsync(command);
      console.log('[Docker Restart API] Command stdout:', stdout)
      if (stderr) console.warn('[Docker Restart API] Command stderr:', stderr)
      
      return NextResponse.json({ 
        success: true,
        message: 'Container restarted successfully',
        details: { stdout, stderr }
      }, { status: 200 });
    } catch (execError) {
      console.error('[Docker Restart API] Command execution failed:', execError)
      return NextResponse.json({ 
        error: 'Failed to restart container',
        details: execError instanceof Error ? execError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('[Docker Restart API] Request processing failed:', error)
    return NextResponse.json({ 
      error: 'Invalid request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}
