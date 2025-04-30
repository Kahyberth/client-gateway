import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @Type(() => Date) // 👈 Esto transforma el string a Date
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Type(() => Date) // 👈 Esto transforma el string a Date
  @IsDate()
  endDate: Date;
}
