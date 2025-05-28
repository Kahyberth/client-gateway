import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/common/nats.interface';
import { CreateSprintDto } from './dto/create-sprint.dto';

@Controller('sprints')
export class SprintsController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('create')
  create(@Body() createSprintDto: CreateSprintDto) {
    return this.client.send('sprints.create.sprint', createSprintDto).pipe(
      catchError((err) => {
        throw new InternalServerErrorException(err);
      }),
    );
  }

  @Get('get-sprint-backlog-issues')
  getSprintBacklogIssues(
    @Query('sprintId') sprintId: string,
    @Query('pagination') pagination: { page: number; limit: number },
    @Query('filters') filters: { status: string; type: string },
  ) {
    return this.client
      .send('sprints.get.sprint_backlog_issues', {
        sprintId,
        pagination,
        filters,
      })
      .pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      );
  }

  @Post('start-sprint')
  startSprint(@Query('sprintId') sprintId: string) {
    console.log('Sprint id', sprintId);
    return this.client.send('sprints.start.sprint', { sprintId }).pipe(
      catchError((err) => {
        throw new InternalServerErrorException(err);
      }),
    );
  }

  @Post('complete-sprint')
  completeSprint(@Query('sprintId') sprintId: string) {
    return this.client.send('sprints.complete.sprint', sprintId).pipe(
      catchError((err) => {
        throw new InternalServerErrorException(err);
      }),
    );
  }
}
