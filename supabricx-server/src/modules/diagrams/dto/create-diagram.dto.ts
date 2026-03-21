import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDiagramDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  nodes?: any;

  @IsOptional()
  edges?: any;

  @IsOptional()
  viewport?: any;
}
