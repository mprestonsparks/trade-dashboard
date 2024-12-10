import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const containerId = url.searchParams.get('containerId');
    const tail = url.searchParams.get('tail') || '100';
    
    if (!containerId) {
      return NextResponse.json({ error: 'Container ID is required' }, { status: 400 });
    }

    // Get container logs
    const { stdout } = await execAsync(`docker logs --tail ${tail} ${containerId}`);

    return NextResponse.json({ logs: stdout });
  } catch (error) {
    console.error('Error getting container logs:', error);
    return NextResponse.json(
      { error: 'Failed to get container logs' }, 
      { status: 500 }
    );
  }
}
