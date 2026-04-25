export const CODE_EXPORT_FORMATS = [
  'TERRAFORM',
  'KUBERNETES',
  'DOCKER_COMPOSE',
  'FASTAPI',
  'EXPRESS',
] as const;

export const DIAGRAM_EXPORT_FORMATS = [
  'PNG',
  'SVG',
  'MERMAID',
  'PDF',
  'JSON',
] as const;

export const EXPORT_FORMATS = [
  ...CODE_EXPORT_FORMATS,
  ...DIAGRAM_EXPORT_FORMATS,
] as const;

export type CodeExportFormat = (typeof CODE_EXPORT_FORMATS)[number];
export type DiagramExportFormat = (typeof DIAGRAM_EXPORT_FORMATS)[number];
export type ExportFormat = (typeof EXPORT_FORMATS)[number];
