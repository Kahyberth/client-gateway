import {
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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from '../common/nats.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { RemoveMemberDto } from './dto/remove-member.dto';

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
  @ApiResponse({
    status: 200,
    description: 'Proyecto actualizado exitosamente',
  })
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

  @ApiOperation({ summary: 'Eliminar un proyecto por ID' })
  @ApiResponse({ status: 200, description: 'Proyecto eliminado exitosamente' })
  @ApiResponse({ status: 400, description: 'ID inválido' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.client.send('projects.delete.project', id).pipe(
      catchError((err) => {
        throw new InternalServerErrorException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Obtener todos los proyectos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de proyectos obtenida exitosamente',
  })
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

  @ApiOperation({ summary: 'Obtener miembros de un proyecto' })
  @ApiResponse({
    status: 200,
    description: 'Lista de miembros obtenida exitosamente',
  })
  @ApiResponse({ status: 400, description: 'ID del proyecto inválido' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Get('members/:projectId')
  async getProjectMembers(
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

  @ApiOperation({ summary: 'Invitar un miembro a un proyecto' })
  @ApiResponse({ status: 200, description: 'Miembro invitado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Post('invite-member')
  async inviteMember(@Body() payload: InviteMemberDto) {
    return this.client.send('projects.invite.member', payload).pipe(
      catchError((err) => {
        throw new InternalServerErrorException(err);
      }),
    );
  }

  
  @Get('team-members/unassigned')
  async getMembersByTeamNotInProject(
    @Query('teamId') teamId: string,
    @Query('projectId') projectId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.client
      .send('projects.members.not.in.project', { teamId, projectId, page, limit })
      .pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      );
  }

  @ApiOperation({ summary: 'Eliminar un miembro de un proyecto' })
  @ApiResponse({ status: 200, description: 'Miembro eliminado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Delete('remove-member')
  async removeMember(@Body() payload: RemoveMemberDto) {
    return this.client.send('projects.remove.member', payload).pipe(
      catchError((err) => {
        throw new InternalServerErrorException(err);
      }),
    );
  }


  @ApiOperation({ summary: 'Obtener proyectos de un equipo' })
  @ApiResponse({ status: 200, description: 'Proyectos obtenidos exitosamente' })
  @ApiResponse({ status: 400, description: 'ID del equipo inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Get('team-projects')
  async getProjectsByTeam(@Query('teamId') teamId: string) {
    return this.client.send('projects.get.projects.by.team', teamId).pipe(
      catchError((err) => {
        throw new InternalServerErrorException(err);
      }),
    );
  }

}
