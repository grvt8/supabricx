import { IsIn, IsString } from 'class-validator';
import {
  CODE_EXPORT_FORMATS,
  CodeExportFormat,
} from '../export-formats';

export class ExportCodeDto {
  @IsString()
  diagramId: string;

  @IsIn(CODE_EXPORT_FORMATS)
  format: CodeExportFormat;
}
