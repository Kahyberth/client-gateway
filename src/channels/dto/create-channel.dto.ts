import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateChannelDto {


  @ApiProperty({
    description: 'The name of the channel',
    example: 'General',
    required: true,
  })
  @IsString()
  name: string; 

  @ApiProperty({
    description: 'The description of the channel',
    example: 'This is a general channel',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;


  @ApiProperty({
    description: 'The ID of the team',
    example: 'team_id_here',
    required: true,
  })
  @IsString()
  team_id: string;

  @ApiProperty({
    description: 'The ID of the user',
    example: 'user_id_here',
    required: true,
  })
  @IsString()
  user_id: string;


  @ApiProperty({
    description: 'Boolean value to mark the channel as private',
    example: 'true',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_private?: boolean;

  @ApiProperty({
    description: 'Boolean value to mark the channel as deleted',
    example: 'true',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_deleted?: boolean;


  @ApiProperty({
    description: 'Channel name for the parent channel',
    example: 'Parent Channel',
    required: false,
  })
  @IsString()
  @IsOptional()
  channel_name?: string;

  @ApiProperty({
    description: 'The ID of the parent channel',
    example: 'parent_channel_id_here',
    required: false,
  })
  @IsString()
  @IsOptional()
  parentChannelId?: string;
}
