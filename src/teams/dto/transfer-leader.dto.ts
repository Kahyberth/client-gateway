import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TransferLeadershipDto {
    @ApiProperty({
      description: 'The ID of the team',
      example: 'team_id_here',
    })
    @IsString()  
    teamId: string;
    @ApiProperty({
      description: 'The ID of the current leader',
      example: 'user_id_here',
    })
    @IsString()
    currentLeaderId: string;
    @ApiProperty({
      description: 'The ID of the new leader',
      example: 'user_id_here',
    })
    @IsString()
    newLeaderId: string;
  }
  