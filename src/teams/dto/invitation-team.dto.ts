import { IsEmail, IsIn, IsNotEmpty, IsString } from "class-validator";


export class InvitationTeamDto {
  @IsString()
  @IsNotEmpty()
  inviterId: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  inviteeEmail: string;

  @IsString()
  teamId: string;

  @IsString()
  roleInTeam: string;
}