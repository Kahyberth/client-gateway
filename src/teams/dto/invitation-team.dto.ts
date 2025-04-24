import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn, IsNotEmpty, IsString } from "class-validator";


export class InvitationTeamDto {
  @ApiProperty({
    description: 'Email of the invitee',
    example: 'juan@test.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  inviteeEmail: string;

  @ApiProperty({
    description: 'The ID of the team',
    example: 'team_id_here',
  })
  @IsString()
  teamId: string;

  @ApiProperty({
    description: 'Role in the team',
    example: 'member',
  })
  @IsString()
  roleInTeam: string;
}