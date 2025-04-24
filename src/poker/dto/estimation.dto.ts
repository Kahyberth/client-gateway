import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class EstimationDto {
  @ApiProperty({
    description: 'The ID of the estimation',
    example: 'estimation_id_here',
  })
  @IsString()
  title: string;


  @ApiProperty({
    description: 'The name of the deck',
    example: 'Deck 1',
  })
  @IsString()
  description: string;


  @ApiProperty({
    description: 'The priority of the deck',
    example: '1,2,3',
  })
  @IsString()
  priority: string;

  @ApiProperty({
    description: 'Acceptance criteria for the estimation',
    example: '[ "Criteria 1", "Criteria 2" ]',
    required: false,
  })
  @IsOptional()
  @IsArray()
  acceptanceCriteria?: string[];

  @ApiProperty({
    description: 'Votes for the estimation',
    example: '[1, 2, 3]',
  })
  @IsArray()
  @IsNumber({}, { each: true })
  votes: number[];

  @ApiProperty({
    description: 'Complexity factors for the estimation',
    example: '[ "Factor 1", "Factor 2" ]',
  })
  @IsArray()
  @IsString({ each: true })
  complexityFactors: string[];

  @ApiProperty({
    description: 'Clarity of the description',
    example: 'High',
  })
  @IsString()
  descriptionClarity: string;
}
