import { IsOptional, IsString } from "class-validator";

export class UpdateTeamDto {
    @IsString()  
    teamId: string;
    @IsString()
    @IsOptional()
    name?: string;
    @IsString()
    @IsOptional()
    description?: string;
    @IsString()
    @IsOptional()
    image?: string;
  }
  