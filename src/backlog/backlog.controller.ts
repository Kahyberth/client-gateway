import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  HttpException,
  HttpStatus,
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
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    try {
      console.log(`Getting all issues for backlog ${id} with page ${page}, limit ${limit}, search ${search}`);
      return this.client
        .send('product-backlog.getBacklogIssues', {
          backlogId: id,
          filters: {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            search: search || ''
          },
        })
        .pipe(
          catchError((err) => {
            console.log(err);
            throw new InternalServerErrorException(err);
          }),
        );
    } catch (error) {
      console.error('Error getting all issues:', error);
      throw new HttpException(
        'Failed to get issues',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

  @Get('project-stats/:id')
  async getProjectStats(@Param('id') projectId: string) {
    console.log(`Gateway: fetching project stats for project: ${projectId}`);
    
    return this.client
      .send('product-backlog.getProjectStats', {
        projectId,
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        }),
      );
  }
}
