import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { containerId } = await req.json();
    
    if (!containerId) {
      return NextResponse.json({ error: 'Container ID is required' }, { status: 400 });
    }

    // Stop the container
    await execAsync(`docker stop ${containerId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error stopping container:', error);
    return NextResponse.json(
      { error: 'Failed to stop container' }, 
      { status: 500 }
    );
  }
}
