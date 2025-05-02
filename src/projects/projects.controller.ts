import { Controller, Post, Body, Inject, Patch, Get, Param } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { NATS_SERVICE } from 'src/common/enums/service.enums';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Controller('projects')
export class ProjectsController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('create')
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.client.send('projects.create.project', createProjectDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  
  @Patch('update/:id')
  async update(@Body() data: any, @Param('id') id: string) {
    return this.client.send('projects.update.project', { id, ...data }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('find/:id')
  async findOneProject(@Param('id') id: string) {
    if (!id) {
      throw new RpcException('Project ID is required');
    }
    return this.client.send('projects.findOne.project', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('findAll')
  async getAll() {
    return this.client.send('projects.findAll.project', {}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
