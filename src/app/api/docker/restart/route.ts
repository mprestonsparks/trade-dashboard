import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

// Helper function to get the project root directory
function getProjectRoot() {
  // In development, we can use process.cwd()
  // In production, you might want to use a different strategy or environment variable
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
  try {
    const { containerId } = await req.json();
    
    if (!containerId) {
      return NextResponse.json({ error: 'Container ID is required' }, { status: 400 });
    }

    // Validate service name for security
    if (!isValidServiceName(containerId)) {
      return NextResponse.json({ 
        error: 'Invalid service name',
        details: 'The specified service is not recognized'
      }, { status: 400 });
    }

    // Use the project root directory
    const projectDir = getProjectRoot();
    
    // Use docker compose to restart the service
    const command = `cd "${projectDir}" && docker compose restart ${containerId}`;
    console.log('Executing command:', command);
    
    const { stdout, stderr } = await execAsync(command);
    console.log('Restart stdout:', stdout);
    
    if (stderr) {
      console.error('Restart stderr:', stderr);
    }

    return NextResponse.json({ 
      success: true,
      stdout,
      stderr
    });
  } catch (error) {
    console.error('Error restarting container:', error);
    return NextResponse.json(
      { 
        error: 'Failed to restart container',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}
