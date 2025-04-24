import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateTeamDto {
    @ApiProperty({
      description: 'The ID of the team',
      example: 'team_id_here',
    })
    @IsString()  
    teamId: string;
    @ApiProperty({
      description: 'Name of the team',
      example: 'Team Name',
    })
    @IsString()
    @IsOptional()
    name?: string;
    @ApiProperty({
      description: 'Description of the team',
      example: 'This is a team',
    })
    @IsString()
    @IsOptional()
    description?: string;
    @ApiProperty({
      description: 'Image URL for the team',
      example: 'https://example.com/image.png',
    })
    @IsString()
    @IsOptional()
    image?: string;
  }
  