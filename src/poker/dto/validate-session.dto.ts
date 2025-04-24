import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ValidateSession {

  @ApiProperty({
    description: 'User ID',
    example: 'user_id_here',
  })
  @IsString()
  user_id: string;
}
