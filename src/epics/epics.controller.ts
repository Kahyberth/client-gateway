import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/common/nats.interface';
import { CreateEpicDto } from './dto/create-epic.dto';
import { UpdateEpicDto } from './dto/update-epic.dto';

@ApiTags('Epics')
@Controller('epics')
export class EpicsController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Crear un nuevo epic' })
  @ApiResponse({ status: 201, description: 'Epic creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Post('create')
  create(@Body() createEpicDto: CreateEpicDto) {
    return this.client.send('epics.create', createEpicDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Obtener epics por product backlog' })
  @ApiResponse({
    status: 200,
    description: 'Lista de epics obtenida exitosamente',
  })
  @ApiResponse({ status: 400, description: 'ID de product backlog inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Get('get-by-backlog/:productBacklogId')
  findByProductBacklog(@Param('productBacklogId') productBacklogId: string) {
    return this.client
      .send('epics.findByProductBacklog', productBacklogId)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @ApiOperation({ summary: 'Obtener un epic por ID' })
  @ApiResponse({ status: 200, description: 'Epic encontrado exitosamente' })
  @ApiResponse({ status: 400, description: 'ID inválido' })
  @ApiResponse({ status: 404, description: 'Epic no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Get('get-epic/:id')
  findOne(@Param('id') id: string) {
    return this.client.send('epics.findOne', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Actualizar un epic' })
  @ApiResponse({ status: 200, description: 'Epic actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Epic no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Put('update')
  update(@Body() updateEpicDto: UpdateEpicDto) {
    return this.client.send('epics.update', updateEpicDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @ApiOperation({ summary: 'Eliminar un epic por ID' })
  @ApiResponse({ status: 200, description: 'Epic eliminado exitosamente' })
  @ApiResponse({ status: 400, description: 'ID inválido' })
  @ApiResponse({ status: 404, description: 'Epic no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Delete('delete-epic/:id')
  remove(@Param('id') id: string) {
    return this.client.send('epics.remove', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
