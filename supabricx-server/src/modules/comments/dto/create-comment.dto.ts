import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MaxLength(2000)
  content: string;

  @IsString()
  @IsOptional()
  nodeId?: string;

  @IsString()
  @IsOptional()
  parentId?: string;
}
