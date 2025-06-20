import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { catchError } from 'rxjs';
import { AuthGuard } from '../auth/guards/auth.guard';
import { NATS_SERVICE } from '../common/nats.interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';

@ApiTags('Issues')
@Controller('issues')
export class IssuesController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Crear un nuevo issue' })
  @ApiResponse({ status: 201, description: 'Issue creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @UseGuards(AuthGuard)
  @Post('create')
  async create(@Body() createIssueDto: CreateIssueDto) {
    return this.client.send('issue.create', createIssueDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Obtener un issue por ID' })
  @ApiResponse({ status: 200, description: 'Issue encontrado exitosamente' })
  @ApiResponse({ status: 400, description: 'ID inválido' })
  @ApiResponse({ status: 404, description: 'Issue no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('issue.find.one', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Actualizar un issue' })
  @ApiResponse({ status: 200, description: 'Issue actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Issue no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @UseGuards(AuthGuard)
  @Patch('update')
  async update(
    @Query('id') id: string,
    @Body() updateIssueDto: UpdateIssueDto,
  ) {
    console.log("Updating issue:", id, updateIssueDto)
    return this.client
      .send('issue.update', { id, updateDto: updateIssueDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @ApiOperation({ summary: 'Eliminar un issue por ID' })
  @ApiResponse({ status: 200, description: 'Issue eliminado exitosamente' })
  @ApiResponse({ status: 400, description: 'ID inválido' })
  @ApiResponse({ status: 404, description: 'Issue no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('issue.remove', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Obtener issues por usuario asignado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de issues obtenida exitosamente',
  })
  @ApiResponse({ status: 400, description: 'ID de usuario inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @UseGuards(AuthGuard)
  @Get('user/:userId')
  async findByAssignedUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.client.send('issues.by.user', userId).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Obtener issues por backlog' })
  @ApiResponse({
    status: 200,
    description: 'Lista de issues obtenida exitosamente',
  })
  @ApiResponse({ status: 400, description: 'ID de backlog inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @UseGuards(AuthGuard)
  @Get('backlog/:backlogId')
  async findByBacklog(@Param('backlogId', ParseUUIDPipe) backlogId: string) {
    return this.client.send('issues.by.backlog', backlogId).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Crear un nuevo comentario' })
  @ApiResponse({ status: 201, description: 'Comentario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @UseGuards(AuthGuard)
  @Post('create-comment')
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.client.send('issues.create.comment', createCommentDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch('update/status/:id')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('newStatus') newStatus: string,
  ) {
    return this.client.send('issues.update.status', { id, newStatus }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Obtener comentarios por issue' })
  @ApiResponse({
    status: 200,
    description: 'Lista de comentarios obtenida exitosamente',
  })
  @ApiResponse({ status: 400, description: 'ID de issue inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @UseGuards(AuthGuard)
  @Get('get-comments/:issueId')
  async getCommentsByIssue(@Param('issueId', ParseUUIDPipe) issueId: string) {
    return this.client.send('issues.get.comments', issueId).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Actualizar un comentario' })
  @ApiResponse({
    status: 200,
    description: 'Comentario actualizado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Comentario no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @UseGuards(AuthGuard)
  @Put('update-comment')
  async updateComment(@Body() updateCommentDto: UpdateCommentDto) {
    const payload = {
      id: updateCommentDto.id,
      updateCommentDto: updateCommentDto,
    };
    return this.client.send('issues.update.comment', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Obtener issues por epic' })
  @ApiResponse({
    status: 200,
    description: 'Lista de issues obtenida exitosamente',
  })
  @ApiResponse({ status: 400, description: 'ID de epic inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @UseGuards(AuthGuard)
  @Get('by-epic/:epicId')
  async findByEpic(@Param('epicId', ParseUUIDPipe) epicId: string) {
    return this.client.send('issues.by-epic', epicId).pipe(
      catchError((err) => {
        throw new InternalServerErrorException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Obtener issues por proyecto' })
  @ApiResponse({
    status: 200,
    description: 'Lista de issues obtenida exitosamente',
  })
  @ApiResponse({ status: 400, description: 'ID de proyecto inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @UseGuards(AuthGuard)
  @Get('by-project/:projectId')
  async findByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.client.send('issues.by.project', projectId).pipe(
      catchError((err) => {
        throw new InternalServerErrorException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Eliminar un comentario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Comentario eliminado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'ID inválido' })
  @ApiResponse({ status: 404, description: 'Comentario no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @UseGuards(AuthGuard)
  @Delete('delete-comment/:id')
  async deleteComment(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('issues.delete.comment', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
