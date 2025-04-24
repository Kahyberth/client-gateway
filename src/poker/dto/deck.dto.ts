import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeckDto {


  @ApiProperty({
    description: 'The ID of the deck',
    example: 'deck_id_here',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The name of the deck',
    example: 'Deck 1',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the deck',
    example: 'This is a deck',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The cards in the deck',
    example: '[1,2,3]',
  })
  @IsString()
  priority: string;
}
