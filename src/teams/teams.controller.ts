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
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/common/enums/service.enums';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateTeamDto } from './dto/create-team-dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

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
          throw new RpcException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Get('get-all-teams')
  async getAllTeams() {
    const result = await firstValueFrom(
      this.client.send('teams.all.teams', {}).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Get('get-team/:id')
  async getTeamById(@Param('id') id: string) {
    const result = await firstValueFrom(
      this.client.send('teams.find.team', id).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Patch('update-team/:id')
  async updateTeam(@Param('id') id: string, @Body() team: CreateTeamDto) {
    const result = await firstValueFrom(
      this.client.send('teams.update.team', { id, team }).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
    return result;
  }

  @UseGuards(AuthGuard)
  @Delete('delete-team/:id')
  async deleteTeam(@Param('id') id: string) {
    const result = await firstValueFrom(
      this.client.send('teams.remove.team', id).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
    return result;
  }
}
