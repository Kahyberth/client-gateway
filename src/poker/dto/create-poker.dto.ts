import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DeckDto } from './deck.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePokerDto {


  @ApiProperty({
    description: 'The name of the session',
    example: 'Session 1',
    required: true,
  })
  @IsString()
  session_name: string;

  @ApiProperty({
    description: 'The ID of the user who created the session',
    example: 'user_id_here',
    required: true,
  })
  @IsString()
  created_by: string;

  @ApiProperty({
    description: 'Session code for the poker session',
    example: 'session_code_here',
    required: false,
  })
  @IsString()
  @IsOptional()
  session_code?: string;

  @ApiProperty({
    description: 'The description of the session',
    example: 'This is a poker session',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The voting scale for the session',
    example: '1,2,3,5,8',
    required: false,
  })
  @IsString()
  @IsOptional()
  voting_scale?: string;

  @ApiProperty({
    description: 'Project ID for the session',
    example: 'project_id_here',
    required: true,
  })
  @IsString()
  project_id: string;

  @ApiProperty({
    description: 'Deck for the session',
    example: '[{"name":"Deck 1","cards":[1,2,3]}]',
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeckDto)
  deck: DeckDto[];

  @ApiProperty({
    description: 'Leader ID for the session',
    example: 'leader_id_here',
    required: true,
  })
  @IsString()
  leader_id: string;
}
