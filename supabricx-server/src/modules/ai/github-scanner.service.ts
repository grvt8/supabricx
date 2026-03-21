import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class GithubScannerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async scanRepository(userId: string, repoUrl: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 25 } },
    });

    const cleaned = repoUrl
      .replace('https://github.com/', '')
      .replace(/\/+$/, '');
    const [owner, repo] = cleaned.split('/');
    if (!owner || !repo) {
      throw new Error('Invalid repoUrl');
    }

    const token = this.configService.get<string>('GITHUB_TOKEN');
    if (!token) {
      throw new Error('Missing GITHUB_TOKEN');
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'supabricx-server',
          Accept: 'application/vnd.github+json',
        },
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${text}`);
    }

    const data = (await response.json()) as { tree?: any[] };
    const analysis = this.analyzeFiles(data.tree ?? []);
    const diagram = this.generateDiagramFromAnalysis();

    return { analysis, diagram };
  }

  private analyzeFiles(files: any[]) {
    const services: any[] = [];
    const databases: any[] = [];
    const dependencies: any[] = [];

    for (const file of files) {
      const path = String(file?.path ?? '');
      if (!path) continue;

      if (path.includes('docker-compose.yml')) services.push({ path });
      if (path.endsWith('package.json') || path.endsWith('requirements.txt')) {
        dependencies.push({ path });
      }
      if (path.endsWith('.tf') || path.includes('terraform/')) {
        services.push({ path });
      }
    }

    return { services, databases, dependencies };
  }

  private generateDiagramFromAnalysis() {
    return { nodes: [], edges: [] };
  }
}
