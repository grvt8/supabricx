import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UseTemplateDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;
}
