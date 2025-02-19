import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  Param,
  Patch,
  Delete,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/common/enums/service.enums';
import { catchError, firstValueFrom } from 'rxjs';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InviteUserTeamDto, LeaveTeamDto, TransferLeadershipDto } from './dto';


@Controller('teams')
export class TeamsController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @UseGuards(AuthGuard)
  @Post('create-team')
  async createTeam(@Body() team: CreateTeamDto) {
    const result = await firstValueFrom(
      this.client.send('teams.create.team', team).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Get('get-all-teams')
  async getAllTeams() {
    const result = await firstValueFrom(
      this.client.send('teams.get.all.teams', {}).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Get('get-team/:id')
  async getTeamById(@Param('id') id: string) {
    const result = await firstValueFrom(
      this.client.send('teams.get.team.by.id', id).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Patch('update-team')
  async updateTeam(@Body() payload: UpdateTeamDto) {
    const result = await firstValueFrom(
      this.client.send('teams.update.team', payload).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Delete('delete-team/:teamId')
  async deleteTeam(@Param('teamId') teamId: string, @Body() payload: { teamId: string, requesterId: string }) {
    payload.teamId = teamId;
    const result = await firstValueFrom(
      this.client.send('teams.delete.team', payload).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }


  @UseGuards(AuthGuard)
  @Post('invite-user/:teamId')
  async inviteUser(@Param('teamId') teamId: string, @Body() data: InviteUserTeamDto) {
    console.log('teamId', teamId);
    data.teamId = teamId;
    const result = await firstValueFrom(
      this.client.send('teams.invite.user', data).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Post('leave-team/:teamId')
  async leaveTeam(@Param('teamId') teamId: string, @Body() data: LeaveTeamDto) {
    data.teamId = teamId;
    const result = await firstValueFrom(
      this.client.send('teams.leave.team', data).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Post('transfer-ownership/:teamId')
  async transferOwnership(@Param('teamId') teamId: string, @Body() data: TransferLeadershipDto) {
    data.teamId = teamId;
    const result = await firstValueFrom(
      this.client.send('teams.transfer.leadership', data).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Post('get-team-by-user/:userId')
  async getTeamByUser(@Param('userId') userId: string) {
    const result = await firstValueFrom(
      this.client.send('teams.get.team.by.user', userId).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }
  
  @UseGuards(AuthGuard)
  @Post('get-members-by-team/:teamId')
  async getMembersByTeam(@Param('teamId') teamId: string) {
    const result = await firstValueFrom(
      this.client.send('teams.get.members.by.team', teamId).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Post('get-teams-by-id/:teamIds')
  async getTeamsById(@Param('teamIds') teamIds: string) {
    const result = await firstValueFrom(
      this.client.send('teams.get.team.by.id', teamIds).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Post('expel-member/:teamId')
  async expelMember(@Param('teamId') teamId: string, @Body() data: any) {
    const result = await firstValueFrom(
      this.client.send('teams.expel.member', { teamId, data }).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

}
