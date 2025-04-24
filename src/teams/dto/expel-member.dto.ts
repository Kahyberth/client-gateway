import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ExpelMemberDto {
    @ApiProperty({
      description: 'The ID of the team',
      example: 'team_id_here',
    })
    @IsString()
    teamId: string;
    @ApiProperty({
      description: 'Leader ID',
      example: 'user_id_here',
    })
    @IsString()
    leaderId: string; 
    @ApiProperty({
      description: 'Member ID',
      example: 'user_id_here',
    })
    @IsString()
    memberId: string; 
  }
  