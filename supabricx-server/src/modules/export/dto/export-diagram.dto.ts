import { IsIn, IsOptional, IsString, IsUrl } from 'class-validator';
import {
  DIAGRAM_EXPORT_FORMATS,
  DiagramExportFormat,
} from '../export-formats';

export class ExportDiagramDto {
  @IsString()
  diagramId: string;

  @IsIn(DIAGRAM_EXPORT_FORMATS)
  format: DiagramExportFormat;

  @IsOptional()
  @IsUrl()
  diagramUrl?: string;
}
