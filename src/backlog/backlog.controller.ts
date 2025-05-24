import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/common/enums/service.enums';
import { CreateIssueDto } from './dto/create-issue.dto';

@Controller('backlog')
export class BacklogController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('add-issue/:id')
  async addIssueToBacklog(
    @Body() createIssueDto: CreateIssueDto,
    @Param('id') productBacklogId: string,
  ) {
    return this.client
      .send('product-backlog.addIssueToBacklog', {
        createIssueDto,
        productBacklogId,
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        }),
      );
  }

  @Get('get-all-issues/:id')
  async getAllIssues(
    @Param('id') backlogId: string,
    @Query('filters') filters: { status?: string },
  ) {
    return this.client
      .send('product-backlog.getBacklogIssues', {
        backlogId,
        filters,
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        }),
      );
  }

  @Get('get-backlog/:id')
  async getBacklog(@Param('id') backlogId: string) {
    return this.client
      .send('product-backlog.getProductBacklog', {
        backlogId,
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        }),
      );
  }

  @Get('get-backlog-by-project/:id')
  async getBacklogByProject(@Param('id') projectId: string) {
    return this.client
      .send('product-backlog.getProductBacklogByProjectId', {
        projectId,
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        }),
      );
  }

  @Post('move-issue-to-sprint')
  async moveIssueToSprint(
    @Query('issueId') issueId: string,
    @Query('sprintId') sprintId: string,
  ) {
    return this.client
      .send('product-backlog.moveIssueToSprint', { issueId, sprintId })
      .pipe(
        catchError((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        }),
      );
  }

  @Post('move-issue-to-backlog')
  async moveIssueToBacklog(
    @Query('issueId') issueId: string,
    @Query('productBacklogId') productBacklogId: string,
  ) {
    return this.client
      .send('product-backlog.moveIssueToBacklog', { issueId, productBacklogId })
      .pipe(
        catchError((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        }),
      );
  }
}
