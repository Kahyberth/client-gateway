import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/common/enums/service.enums';
import { CreateProjectDto } from './dto/create-project.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Crear un nuevo proyecto' })
  @ApiResponse({ status: 201, description: 'Proyecto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Post('create')
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.client.send('projects.create.project', createProjectDto).pipe(
      catchError((err) => {
        throw new InternalServerErrorException(err);
      }),
    );
  }

  
  @ApiOperation({ summary: 'Actualizar un proyecto por ID' })
  @ApiResponse({ status: 200, description: 'Proyecto actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Patch('update/:id')
  async update(@Body() data: any, @Param('id') id: string) {
    return this.client.send('projects.update.project', { id, ...data }).pipe(
      catchError((err) => {
        throw new InternalServerErrorException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Obtener un proyecto por ID' })
  @ApiResponse({ status: 200, description: 'Proyecto encontrado exitosamente' })
  @ApiResponse({ status: 400, description: 'ID inválido' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Get('find/:id')
  async findOneProject(@Param('id') id: string) {
    if (!id) {
      throw new InternalServerErrorException('Project ID is required');
    }
    return this.client.send('projects.findOne.project', id).pipe(
      catchError((err) => {
        throw new InternalServerErrorException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Obtener todos los proyectos' })
  @ApiResponse({ status: 200, description: 'Lista de proyectos obtenida exitosamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Get('findAll')
  async getAll() {
    return this.client.send('projects.findAll.project', {}).pipe(
      catchError((err) => {
        throw new InternalServerErrorException(err);
      }),
    );
  }

  @Get('findAllByUser')
  async findAllProjectsByUser(
    @Query('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.client
      .send('projects.findAllByUser.project', { userId, page, limit })
      .pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      );
  }

  @Get('members/:projectId')
  async getProjectMembersPaginated(
    @Param('projectId') projectId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.client
      .send('projects.members.paginated', { projectId, page, limit })
      .pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      );
  }
}
