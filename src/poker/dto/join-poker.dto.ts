import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';
export class JoinPokerDto {
  @IsString()
  sessions_name: string;

  @IsUUID()
  user_id: string;

  @IsOptional()
  @IsString()
  role?: string = 'participant';

  // @IsString()
  // @IsOptional()
  // room_code?: string;
}