import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import JSZip from 'jszip';
import { PrismaService } from '../../database/prisma.service';
import { DiagramsService } from '../diagrams/diagrams.service';
import { R2Service } from '../storage/r2.service';
import { UsersService } from '../users/users.service';
import { DiagramExportService } from './diagram-export.service';
import {
  CodeExportFormat,
  DiagramExportFormat,
} from './export-formats';

type GeneratedFile = {
  path: string;
  content: string;
};

@Injectable()
export class ExportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly diagramsService: DiagramsService,
    private readonly r2Service: R2Service,
    private readonly usersService: UsersService,
    private readonly diagramExportService: DiagramExportService,
  ) {}

  async exportCode(userId: string, diagramId: string, format: CodeExportFormat) {
    const diagram = await this.diagramsService.findOne(diagramId, userId);
    await this.usersService.deductCredits(userId, 10, 'CODE_EXPORT');

    const files = this.generateCode(
      diagram.name,
      this.asArray(diagram.nodes),
      this.asArray(diagram.edges),
      format,
    );

    const zip = new JSZip();
    files.forEach((file) => zip.file(file.path, file.content));

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    const upload = await this.r2Service.uploadCodeExport(
      userId,
      diagramId,
      zipBuffer,
      format,
    );

    const exportRecord = await this.prisma.export.create({
      data: {
        diagramId,
        userId,
        format,
        filePath: upload.key,
        fileSize: zipBuffer.length,
        expiresAt: this.getExpiryDate(),
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        diagramId,
        action: 'CODE_EXPORT_CREATED',
        metadata: { exportId: exportRecord.id, format },
      },
    });

    return {
      exportId: exportRecord.id,
      format,
      filePath: upload.key,
      expiresAt: exportRecord.expiresAt,
      downloadUrl: await this.r2Service.getSignedUrl(upload.key),
    };
  }

  async exportDiagram(
    userId: string,
    diagramId: string,
    format: DiagramExportFormat,
    diagramUrl?: string,
  ) {
    const diagram = await this.diagramsService.findOne(diagramId, userId);
    const nodes = this.asArray(diagram.nodes);
    const edges = this.asArray(diagram.edges);

    let buffer: Buffer;
    let contentType: string;
    let extension: string;

    switch (format) {
      case 'PNG':
        if (!diagramUrl) {
          throw new BadRequestException('diagramUrl is required for PNG export');
        }
        buffer = await this.diagramExportService.exportToPng(diagramUrl);
        contentType = 'image/png';
        extension = 'png';
        break;
      case 'PDF':
        if (!diagramUrl) {
          throw new BadRequestException('diagramUrl is required for PDF export');
        }
        buffer = await this.diagramExportService.exportToPdf(diagramUrl);
        contentType = 'application/pdf';
        extension = 'pdf';
        break;
      case 'SVG': {
        const svg = this.diagramExportService.exportToSvg(nodes, edges, diagram.name);
        buffer = Buffer.from(svg, 'utf8');
        contentType = 'image/svg+xml';
        extension = 'svg';
        break;
      }
      case 'MERMAID': {
        const mermaid = this.diagramExportService.exportToMermaid(nodes, edges);
        buffer = Buffer.from(mermaid, 'utf8');
        contentType = 'text/plain';
        extension = 'mmd';
        break;
      }
      case 'JSON': {
        const json = this.diagramExportService.exportToJson(nodes, edges);
        buffer = Buffer.from(json, 'utf8');
        contentType = 'application/json';
        extension = 'json';
        break;
      }
      default:
        throw new BadRequestException('Unsupported diagram export format');
    }

    const fileKey = `exports/${userId}/${diagramId}/${Date.now()}.${extension}`;
    const upload = await this.r2Service.uploadFile(fileKey, buffer, contentType, {
      userId,
      diagramId,
      format,
      type: 'diagram-export',
    });

    const exportRecord = await this.prisma.export.create({
      data: {
        diagramId,
        userId,
        format,
        filePath: upload.key,
        fileSize: buffer.length,
        expiresAt: this.getExpiryDate(),
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        diagramId,
        action: 'DIAGRAM_EXPORT_CREATED',
        metadata: { exportId: exportRecord.id, format },
      },
    });

    return {
      exportId: exportRecord.id,
      format,
      filePath: upload.key,
      expiresAt: exportRecord.expiresAt,
      downloadUrl: await this.r2Service.getSignedUrl(upload.key),
    };
  }

  listExports(userId: string, diagramId?: string) {
    return this.prisma.export.findMany({
      where: {
        userId,
        ...(diagramId ? { diagramId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDownloadUrl(userId: string, exportId: string) {
    const record = await this.prisma.export.findFirst({
      where: { id: exportId, userId },
    });

    if (!record) {
      throw new NotFoundException('Export not found');
    }

    if (record.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException('Export has expired');
    }

    await this.prisma.export.update({
      where: { id: exportId },
      data: { downloadCount: { increment: 1 } },
    });

    return {
      exportId: record.id,
      format: record.format,
      expiresAt: record.expiresAt,
      downloadUrl: await this.r2Service.getSignedUrl(record.filePath),
    };
  }

  private generateCode(
    diagramName: string,
    nodes: Record<string, unknown>[],
    edges: Record<string, unknown>[],
    format: CodeExportFormat,
  ): GeneratedFile[] {
    switch (format) {
      case 'TERRAFORM':
        return this.generateTerraform(diagramName, nodes, edges);
      case 'KUBERNETES':
        return this.generateKubernetes(diagramName, nodes, edges);
      case 'DOCKER_COMPOSE':
        return this.generateDockerCompose(diagramName, nodes, edges);
      case 'FASTAPI':
        return this.generateFastApi(diagramName, nodes, edges);
      case 'EXPRESS':
        return this.generateExpress(diagramName, nodes, edges);
      default:
        throw new BadRequestException('Unsupported code export format');
    }
  }

  private generateTerraform(
    diagramName: string,
    nodes: Record<string, unknown>[],
    edges: Record<string, unknown>[],
  ): GeneratedFile[] {
    const resources = nodes
      .map((node, index) => {
        const safeName = this.toSnakeCase(this.nodeLabel(node) || `service_${index + 1}`);
        return [
          `resource "null_resource" "${safeName}" {`,
          '  triggers = {',
          `    name = "${safeName}"`,
          `    type = "${String(node.type || node['type'] || 'service')}"`,
          '  }',
          '}',
        ].join('\n');
      })
      .join('\n\n');

    return [
      {
        path: 'main.tf',
        content: [
          `# Terraform scaffold for ${diagramName}`,
          resources || '# No resources generated from diagram nodes',
          '',
        ].join('\n'),
      },
      {
        path: 'README.md',
        content: this.renderReadme(diagramName, 'Terraform', nodes, edges),
      },
    ];
  }

  private generateKubernetes(
    diagramName: string,
    nodes: Record<string, unknown>[],
    edges: Record<string, unknown>[],
  ): GeneratedFile[] {
    const manifests = nodes
      .map((node, index) => {
        const appName = this.toKebabCase(this.nodeLabel(node) || `service-${index + 1}`);
        return [
          'apiVersion: apps/v1',
          'kind: Deployment',
          'metadata:',
          `  name: ${appName}`,
          'spec:',
          '  replicas: 1',
          '  selector:',
          '    matchLabels:',
          `      app: ${appName}`,
          '  template:',
          '    metadata:',
          '      labels:',
          `        app: ${appName}`,
          '    spec:',
          '      containers:',
          '        - name: app',
          '          image: nginx:stable',
          '---',
          'apiVersion: v1',
          'kind: Service',
          'metadata:',
          `  name: ${appName}`,
          'spec:',
          '  selector:',
          `    app: ${appName}`,
          '  ports:',
          '    - port: 80',
          '      targetPort: 80',
        ].join('\n');
      })
      .join('\n---\n');

    return [
      { path: 'manifests.yaml', content: manifests || '# No manifests generated\n' },
      {
        path: 'README.md',
        content: this.renderReadme(diagramName, 'Kubernetes', nodes, edges),
      },
    ];
  }

  private generateDockerCompose(
    diagramName: string,
    nodes: Record<string, unknown>[],
    edges: Record<string, unknown>[],
  ): GeneratedFile[] {
    const services = nodes
      .map((node, index) => {
        const serviceName = this.toKebabCase(
          this.nodeLabel(node) || `service-${index + 1}`,
        );
        return [
          `  ${serviceName}:`,
          '    image: nginx:stable',
          '    ports:',
          `      - "${8080 + index}:80"`,
        ].join('\n');
      })
      .join('\n');

    return [
      {
        path: 'docker-compose.yml',
        content: [
          `# Docker Compose scaffold for ${diagramName}`,
          'version: "3.9"',
          'services:',
          services || '  app:\n    image: nginx:stable',
          '',
        ].join('\n'),
      },
      {
        path: 'README.md',
        content: this.renderReadme(diagramName, 'Docker Compose', nodes, edges),
      },
    ];
  }

  private generateFastApi(
    diagramName: string,
    nodes: Record<string, unknown>[],
    edges: Record<string, unknown>[],
  ): GeneratedFile[] {
    return [
      {
        path: 'app/main.py',
        content: [
          'from fastapi import FastAPI',
          '',
          'app = FastAPI(title="Supabricx Export")',
          '',
          '@app.get("/health")',
          'def health():',
          `    return {"status": "ok", "diagram": "${diagramName}"}`,
          '',
        ].join('\n'),
      },
      {
        path: 'requirements.txt',
        content: 'fastapi\nuvicorn[standard]\n',
      },
      {
        path: 'README.md',
        content: this.renderReadme(diagramName, 'FastAPI', nodes, edges),
      },
    ];
  }

  private generateExpress(
    diagramName: string,
    nodes: Record<string, unknown>[],
    edges: Record<string, unknown>[],
  ): GeneratedFile[] {
    return [
      {
        path: 'src/index.js',
        content: [
          "const express = require('express');",
          '',
          'const app = express();',
          'app.use(express.json());',
          '',
          "app.get('/health', (_req, res) => {",
          `  res.json({ status: 'ok', diagram: '${diagramName}' });`,
          '});',
          '',
          'const port = process.env.PORT || 3000;',
          'app.listen(port, () => {',
          "  console.log(`Server listening on port ${port}`);",
          '});',
          '',
        ].join('\n'),
      },
      {
        path: 'package.json',
        content: JSON.stringify(
          {
            name: this.toKebabCase(diagramName) || 'supabricx-export',
            version: '1.0.0',
            private: true,
            main: 'src/index.js',
            scripts: { start: 'node src/index.js' },
            dependencies: { express: '^4.21.0' },
          },
          null,
          2,
        ),
      },
      {
        path: 'README.md',
        content: this.renderReadme(diagramName, 'Express', nodes, edges),
      },
    ];
  }

  private renderReadme(
    diagramName: string,
    formatLabel: string,
    nodes: Record<string, unknown>[],
    edges: Record<string, unknown>[],
  ): string {
    return [
      `# ${diagramName}`,
      '',
      `Generated by Supabricx as a ${formatLabel} starter export.`,
      '',
      `Nodes: ${nodes.length}`,
      `Edges: ${edges.length}`,
      '',
      'Review the generated files and adapt them to your infrastructure requirements.',
      '',
    ].join('\n');
  }

  private asArray(value: Prisma.JsonValue): Record<string, unknown>[] {
    return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  }

  private getExpiryDate(): Date {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  private nodeLabel(node: Record<string, unknown>): string {
    const data =
      node.data && typeof node.data === 'object'
        ? (node.data as Record<string, unknown>)
        : undefined;

    const label = data?.label || data?.name || node.label || node.id;
    return typeof label === 'string' ? label : 'service';
  }

  private toSnakeCase(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  private toKebabCase(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
