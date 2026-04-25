import { ExportFormat } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class ExportCodeDto {
  @IsString()
  diagramId: string;

  @IsEnum([
    ExportFormat.TERRAFORM,
    ExportFormat.KUBERNETES,
    ExportFormat.DOCKER_COMPOSE,
    ExportFormat.FASTAPI,
    ExportFormat.EXPRESS,
  ])
  format: ExportFormat;
}
