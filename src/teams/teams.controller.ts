import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { catchError, firstValueFrom } from 'rxjs';
import { AuthGuard } from '../auth/guards/auth.guard';
import { NATS_SERVICE } from '../common/nats.interface';
import {
  ExpelMemberDto,
  InvitationTeamDto,
  InviteUserTeamDto,
  LeaveTeamDto,
  TransferLeadershipDto,
} from './dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@ApiTags('Teams')
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
          console.log(err);
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Get('get-all-teams')
  async getAllTeams(@Query('page') page?: number) {
    if (!page) {
      page = 1;
    }
    const result = await firstValueFrom(
      this.client.send('teams.get.all.teams', page).pipe(
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
  async deleteTeam(
    @Param('teamId') teamId: string,
    @Body() payload: { teamId: string; requesterId: string },
  ) {
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
  async inviteUser(
    @Param('teamId') teamId: string,
    @Body() data: InviteUserTeamDto,
  ) {
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
  async transferOwnership(
    @Param('teamId') teamId: string,
    @Body() data: TransferLeadershipDto,
  ) {
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
  @Get('get-team-by-user/:userId')
  async getTeamByUser(
    @Param('userId') userId: string,
    @Query('page') page?: number,
  ) {
    if (!page) {
      page = 1;
    }
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    const result = await firstValueFrom(
      this.client.send('teams.by.user', { userId, page }).pipe(
        catchError((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Get('get-members-by-team/:teamId')
  async getMembersByTeam(
    @Param('teamId') teamId: string,
    @Query('page') page?: number,
  ) {
    if (!page) {
      page = 1;
    }
    const result = await firstValueFrom(
      this.client.send('teams.paginate.members.by.team', { teamId, page }).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Get('get-team-by-id/:teamId')
  async getTeamsById(@Param('teamId') teamId: string) {
    const result = await firstValueFrom(
      this.client.send('teams.by.id', teamId).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Post('expel-member/:teamId')
  async expelMember(
    @Param('teamId') teamId: string,
    @Body() data: ExpelMemberDto,
  ) {
    data.teamId = teamId;
    const result = await firstValueFrom(
      this.client.send('teams.expel.member', data).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Post('generate-invite-link/:teamId')
  async generateInviteLink(
    @Param('teamId') teamId: string,
    @Body() data: InvitationTeamDto,
  ) {
    data.teamId = teamId;
    const result = await firstValueFrom(
      this.client.send('teams.invite.user.by.email', data).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @Post('accept-invite')
  async acceptInvite(
    @Body()
    payload: {
      token: string;
      inviteeEmail: string;
      roleInTeam: string;
    },
  ) {
    const result = await firstValueFrom(
      this.client.send('teams.accept.invitation', payload).pipe(
        catchError((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Get('get-invite-link/:teamId')
  async getInviteLink(@Param('teamId') teamId: string) {
    const result = await firstValueFrom(
      this.client.send('teams.get.invite.link', teamId).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @Post('validate-invite-link')
  async validateInviteLink(@Body('token') token: string) {
    const result = await firstValueFrom(
      this.client.send('teams.verify.invitation', token).pipe(
        catchError((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }
}
