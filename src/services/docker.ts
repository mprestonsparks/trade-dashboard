import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: string;
  state: string;
  ports: string[];
}

export class DockerService {
  async listContainers(): Promise<DockerContainer[]> {
    try {
      const { stdout } = await execAsync(
        'docker ps -a --format "{{.ID}}\\t{{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.State}}\\t{{.Ports}}"'
      );
      
      return stdout.trim().split('\n').map(line => {
        const [id, name, image, status, state, ports] = line.split('\t');
        return {
          id,
          name,
          image,
          status,
          state,
          ports: ports ? ports.split(', ') : []
        };
      });
    } catch (error) {
      console.error('Error listing containers:', error);
      throw error;
    }
  }

  async restartContainer(containerId: string): Promise<void> {
    try {
      await execAsync(`docker restart ${containerId}`);
    } catch (error) {
      console.error(`Error restarting container ${containerId}:`, error);
      throw error;
    }
  }

  async stopContainer(containerId: string): Promise<void> {
    try {
      await execAsync(`docker stop ${containerId}`);
    } catch (error) {
      console.error(`Error stopping container ${containerId}:`, error);
      throw error;
    }
  }

  async startContainer(containerId: string): Promise<void> {
    try {
      await execAsync(`docker start ${containerId}`);
    } catch (error) {
      console.error(`Error starting container ${containerId}:`, error);
      throw error;
    }
  }

  async getContainerLogs(containerId: string, tail: number = 100): Promise<string> {
    try {
      const { stdout } = await execAsync(`docker logs --tail ${tail} ${containerId}`);
      return stdout;
    } catch (error) {
      console.error(`Error getting logs for container ${containerId}:`, error);
      throw error;
    }
  }
}
