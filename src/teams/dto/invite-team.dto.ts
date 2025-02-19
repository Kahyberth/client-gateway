import { IsIn, IsString } from "class-validator";

export class InviteUserTeamDto {
  @IsString()
  teamId: string;
  @IsString()
  inviterId: string;
  @IsString()
  inviteeId: string;
  @IsString()
  roleInTeam: string;
}
