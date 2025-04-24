import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class InviteUserTeamDto {
  @ApiProperty({
    description: 'The ID of the team',
    example: 'team_id_here',
  })
  @IsString()
  teamId: string;
  @ApiProperty({
    description: 'The ID of the inviter',
    example: 'user_id_here',
  })
  @IsString()
  inviterId: string;
  @IsString()
  @ApiProperty({
    description: 'The ID of the invitee',
    example: 'user_id_here',
  })
  inviteeId: string;
  @ApiProperty({
    description: 'Role in the team',
    example: 'member',
  })
  @IsString()
  roleInTeam: string;
}
