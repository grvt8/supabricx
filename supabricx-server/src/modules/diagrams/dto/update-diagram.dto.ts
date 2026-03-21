import { IsOptional, IsString } from 'class-validator';

export class UpdateDiagramDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  nodes?: any;

  @IsOptional()
  edges?: any;

  @IsOptional()
  viewport?: any;

  @IsOptional()
  @IsString()
  versionMessage?: string;
}
