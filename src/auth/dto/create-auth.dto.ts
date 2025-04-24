import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ description: 'The first name of the user', example: 'Jhon' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The last name of the user', example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'user@test.com',
    required: true,
  })
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @ApiProperty({
    description: 'The company of the user',
    example: 'Test Company',
  })
  company: string;
  @ApiProperty({
    description: 'The phone of the user',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
