import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Inject,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/common/enums/service.enums';
import { CreateEpicDto } from './dto/create-epic.dto';
import { UpdateEpicDto } from './dto/update-epic.dto';

@Controller('epics')
export class EpicsController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('create')
  create(@Body() createEpicDto: CreateEpicDto) {
    return this.client.send('epics.create', createEpicDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('get-by-backlog/:productBacklogId')
  findByProductBacklog(@Param('productBacklogId') productBacklogId: string) {
    return this.client.send('epics.findByProductBacklog', productBacklogId).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('get-epic/:id')
  findOne(@Param('id') id: string) {
    return this.client.send('epics.findOne', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Put('update')
  update(@Body() updateEpicDto: UpdateEpicDto) {
    return this.client.send('epics.update', updateEpicDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete('delete-epic/:id')
  remove(@Param('id') id: string) {
    return this.client.send('epics.remove', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
} 