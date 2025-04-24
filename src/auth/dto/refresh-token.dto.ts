import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
  @ApiProperty({
    description: 'The refresh token of the user',
    example: 'token here!',
    required: true,
  })
  refreshToken: string;
}
