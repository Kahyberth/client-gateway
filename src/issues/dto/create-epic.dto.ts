import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';

export class CreateEpicDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['review', 'to-do', 'in-progress', 'resolved', 'closed'])
  @IsOptional()
  status?: string;

  @IsUUID()
  productBacklogId: string;
} 