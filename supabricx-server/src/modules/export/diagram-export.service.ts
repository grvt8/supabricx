import { BadRequestException, Injectable } from '@nestjs/common';

type DiagramNode = {
  id?: string;
  data?: { label?: string; name?: string; type?: string };
  type?: string;
};

type DiagramEdge = {
  source?: string;
  target?: string;
  label?: string;
};

@Injectable()
export class DiagramExportService {
  async exportToPng(diagramUrl: string): Promise<Buffer> {
    const browser = await this.launchBrowser();

    try {
      const page = await browser.newPage();
      await page.goto(diagramUrl, { waitUntil: 'networkidle0' });
      const screenshot = await page.screenshot({ fullPage: true, type: 'png' });
      return Buffer.isBuffer(screenshot)
        ? screenshot
        : Buffer.from(screenshot);
    } finally {
      await browser.close();
    }
  }

  async exportToPdf(diagramUrl: string): Promise<Buffer> {
    const browser = await this.launchBrowser();

    try {
      const page = await browser.newPage();
      await page.goto(diagramUrl, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({ format: 'A4', printBackground: true });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  exportToSvg(
    nodes: DiagramNode[],
    edges: DiagramEdge[],
    title = 'Supabricx Diagram',
  ): string {
    const width = 1200;
    const height = Math.max(400, nodes.length * 110 + 120);
    const safeTitle = this.escapeXml(title);

    const nodeElements = nodes
      .map((node, index) => {
        const x = 80 + (index % 3) * 340;
        const y = 80 + Math.floor(index / 3) * 140;
        const label = this.escapeXml(this.getNodeLabel(node));
        const kind = this.escapeXml(node.data?.type || node.type || 'service');

        return [
          `<rect x="${x}" y="${y}" width="240" height="72" rx="14" fill="#111827" stroke="#60a5fa" stroke-width="2" />`,
          `<text x="${x + 20}" y="${y + 32}" fill="#f9fafb" font-size="20" font-family="Arial, sans-serif">${label}</text>`,
          `<text x="${x + 20}" y="${y + 54}" fill="#93c5fd" font-size="12" font-family="Arial, sans-serif">${kind}</text>`,
        ].join('');
      })
      .join('');

    const edgeElements = edges
      .map((edge, index) => {
        const sourceIndex = Math.max(0, this.findNodeIndex(nodes, edge.source));
        const targetIndex = Math.max(0, this.findNodeIndex(nodes, edge.target));
        const sourceX = 200 + (sourceIndex % 3) * 340;
        const sourceY = 152 + Math.floor(sourceIndex / 3) * 140;
        const targetX = 200 + (targetIndex % 3) * 340;
        const targetY = 80 + Math.floor(targetIndex / 3) * 140;
        const label = this.escapeXml(edge.label || '');

        const text =
          label.length > 0
            ? `<text x="${(sourceX + targetX) / 2}" y="${(sourceY + targetY) / 2 - 8}" fill="#cbd5e1" font-size="12" text-anchor="middle" font-family="Arial, sans-serif">${label}</text>`
            : '';

        return [
          `<line x1="${sourceX}" y1="${sourceY}" x2="${targetX}" y2="${targetY}" stroke="#64748b" stroke-width="2" marker-end="url(#arrow-${index})" />`,
          `<defs><marker id="arrow-${index}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#64748b" /></marker></defs>`,
          text,
        ].join('');
      })
      .join('');

    return [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
      '<rect width="100%" height="100%" fill="#020617" />',
      `<text x="60" y="48" fill="#f8fafc" font-size="24" font-family="Arial, sans-serif">${safeTitle}</text>`,
      edgeElements,
      nodeElements,
      '</svg>',
    ].join('');
  }

  exportToMermaid(nodes: DiagramNode[], edges: DiagramEdge[]): string {
    const lines = ['graph TD'];

    nodes.forEach((node) => {
      const id = this.normalizeMermaidId(node.id || 'node');
      const label = this.escapeMermaidLabel(this.getNodeLabel(node));
      lines.push(`  ${id}[${label}]`);
    });

    edges.forEach((edge, index) => {
      const source = this.normalizeMermaidId(edge.source || `source_${index}`);
      const target = this.normalizeMermaidId(edge.target || `target_${index}`);
      const label = edge.label?.trim();

      if (label) {
        lines.push(`  ${source} -->|${this.escapeMermaidLabel(label)}| ${target}`);
      } else {
        lines.push(`  ${source} --> ${target}`);
      }
    });

    return `${lines.join('\n')}\n`;
  }

  exportToJson(nodes: DiagramNode[], edges: DiagramEdge[]) {
    return JSON.stringify({ nodes, edges }, null, 2);
  }

  private async launchBrowser() {
    try {
      const puppeteer = await import('puppeteer');
      return puppeteer.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    } catch {
      throw new BadRequestException(
        'Puppeteer is not available for PNG/PDF export',
      );
    }
  }

  private getNodeLabel(node: DiagramNode): string {
    return node.data?.label || node.data?.name || node.id || 'Node';
  }

  private findNodeIndex(nodes: DiagramNode[], nodeId?: string): number {
    if (!nodeId) {
      return 0;
    }

    return Math.max(
      nodes.findIndex((node) => node.id === nodeId),
      0,
    );
  }

  private escapeXml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private normalizeMermaidId(value: string): string {
    return value.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  private escapeMermaidLabel(value: string): string {
    return value.replace(/"/g, '\\"');
  }
}
