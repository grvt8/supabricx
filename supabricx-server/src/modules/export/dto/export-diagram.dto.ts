import { ExportFormat } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export class ExportDiagramDto {
  @IsString()
  diagramId: string;

  @IsEnum([
    ExportFormat.PNG,
    ExportFormat.SVG,
    ExportFormat.MERMAID,
    ExportFormat.PDF,
    ExportFormat.JSON,
  ])
  format: ExportFormat;

  @IsOptional()
  @IsUrl()
  diagramUrl?: string;
}
