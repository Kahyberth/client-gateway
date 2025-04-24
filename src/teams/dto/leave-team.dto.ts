import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LeaveTeamDto {
  @ApiProperty({
    description: 'The ID of the team',
    example: 'team_id_here',
  })
  @IsString()
  teamId: string;
  @ApiProperty({
    description: 'User ID',
    example: 'user_id_here',
  })
  @IsString()
  userId: string;
}
