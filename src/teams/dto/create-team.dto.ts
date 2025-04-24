import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({
    description: 'The name of the team',
    example: 'Team A',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the team',
    example: 'This is a team',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The ID of the leader',
    example: 'user_id_here',
  })
  @IsString()
  leaderId: string;

  @ApiProperty({
    description: 'Image URL for the team',
    example: 'https://example.com/image.png',
  })
  @IsString()
  @IsOptional()
  image?: string;
}
