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
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/common/enums/service.enums';
import { CreateProjectDto } from './dto/create-project.dto';
import { InviteMemberDto } from './dto/invite-member.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Crear un nuevo proyecto' })
  @ApiResponse({ status: 201, description: 'Proyecto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe un proyecto con este nombre' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Post('create')
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.client.send('projects.create.project', createProjectDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
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
        throw new RpcException(err);
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
      throw new RpcException({
        status: 400,
        message: 'Project ID is required'
      });
    }
    return this.client.send('projects.findOne.project', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
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
        throw new RpcException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Obtener proyectos por ID de usuario' })
  @ApiResponse({ status: 200, description: 'Lista de proyectos obtenida exitosamente' })
  @ApiResponse({ status: 400, description: 'ID de usuario inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Get('findByUser/:userId')
  async getProjectsByUser(@Param('userId') userId: string) {
    console.log('Fetching projects for userId:', userId);
    if (!userId) {
      throw new RpcException({
        status: 400,
        message: 'User ID is required'
      });
    }
    return this.client.send('projects.findByUser.project', userId).pipe(
      catchError((err) => {
        console.error('Error fetching projects for user:', err);
        throw new RpcException(err);
      }),
    );
  }
  
  @ApiOperation({ summary: 'Obtener proyectos por ID de usuario con paginación' })
  @ApiResponse({ status: 200, description: 'Lista de proyectos obtenida exitosamente con paginación' })
  @ApiResponse({ status: 400, description: 'ID de usuario inválido o página inválida' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
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

  @ApiOperation({ summary: 'Obtener issues del backlog de un proyecto' })
  @ApiResponse({ status: 200, description: 'Lista de issues obtenidas exitosamente' })
  @ApiResponse({ status: 400, description: 'ID del proyecto inválido' })
  @ApiResponse({ status: 404, description: 'Proyecto o backlog no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Get('issues/:projectId')
  async getProjectIssues(@Param('projectId') projectId: string) {
    if (!projectId) {
      throw new RpcException({
        status: 400,
        message: 'Project ID is required'
      });
    }
    
    // Primero obtenemos el product backlog del proyecto
    const backlog = await this.client.send('product-backlog.getProductBacklogByProjectId', { projectId }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    ).toPromise();
    
    if (!backlog) {
      throw new RpcException({
        status: 404,
        message: 'Product backlog not found for this project'
      });
    }
    
    // Luego obtenemos las issues del backlog
    return this.client.send('product-backlog.getBacklogIssues', { backlogId: backlog.id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Obtener miembros de un proyecto' })
  @ApiResponse({ status: 200, description: 'Lista de miembros obtenida exitosamente' })
  @ApiResponse({ status: 400, description: 'ID del proyecto inválido' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Get('members/:projectId')
  async getProjectMembers(@Param('projectId') projectId: string) {
    if (!projectId) {
      throw new RpcException({
        status: 400,
        message: 'Project ID is required'
      });
    }
    
    try {
      // Primero obtenemos los miembros del proyecto
      const members = await this.client.send('projects.getMembers', projectId).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ).toPromise();
      
      if (!members) {
        throw new RpcException({
          status: 404,
          message: 'No members found for this project'
        });
      }
      
      // Obtenemos los datos de usuario para cada miembro
      const membersWithDetails = await Promise.all(
        members.map(async (member: any) => {
          try {
            const userDetails = await this.client.send('auth.find.user.by.id', member.user_id).pipe(
              catchError((err) => {
                console.error(`Error fetching user details for ${member.user_id}:`, err);
                return null;
              }),
            ).toPromise();
            
            return {
              ...member,
              user: userDetails,
              initials: userDetails ? this.getInitials(userDetails.name, userDetails.lastName) : 'U'
            };
          } catch (error) {
            console.error(`Error processing member ${member.user_id}:`, error);
            return {
              ...member,
              user: null,
              initials: 'U'
            };
          }
        })
      );
      
      return membersWithDetails;
    } catch (error) {
      console.error(`Error fetching project members for ${projectId}:`, error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: 500,
        message: 'Error fetching project members'
      });
    }
  }
  
  // Función auxiliar para generar iniciales a partir del nombre
  private getInitials(firstName: string, lastName?: string): string {
    if (!firstName) return 'U';
    
    const firstInitial = firstName.charAt(0).toUpperCase();
    let secondInitial = '';
    
    if (lastName && lastName.length > 0) {
      secondInitial = lastName.charAt(0).toUpperCase();
    } else if (firstName.includes(' ')) {
      const nameParts = firstName.split(' ');
      if (nameParts.length > 1 && nameParts[1].length > 0) {
        secondInitial = nameParts[1].charAt(0).toUpperCase();
      }
    }
    
    return secondInitial ? `${firstInitial}${secondInitial}` : firstInitial;
  }

  @ApiOperation({ summary: 'Invitar miembro a un proyecto' })
  @ApiResponse({ status: 201, description: 'Invitación enviada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  @ApiResponse({ status: 409, description: 'El usuario ya es miembro del proyecto' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Post('invite-member')
  async inviteMember(@Body() inviteMemberDto: InviteMemberDto) {
    console.log('Sending invitation to project member:', inviteMemberDto);
    return this.client.send('projects.invite.member', inviteMemberDto).pipe(
      catchError((err) => {
        console.error('Error inviting member:', err);
        throw new RpcException(err);
      }),
    );
  }
}
