import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { CreatePokerDto } from './dto/create-poker.dto';
import { NATS_SERVICE } from 'src/common/enums/service.enums';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

@Controller('poker')
export class PokerController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('create-session')
  create(@Body() createPokerDto: CreatePokerDto) {
    return this.client.send('poker.create.session', createPokerDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('all-sessions')
  getAllRooms() {
    return this.client.send('poker.get.all.session', {}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('verify-user')
  verifyUser(@Body() data: any) {
    console.log('Data received:', data);
    return this.client.send('poker.verify.user', data).pipe(
      catchError((err) => {
        console.error('Error from microservice:', err);
        throw new BadRequestException({
          message: err?.message || 'An error occurred',
          statusCode: err?.code || 400,
        });
      }),
    );
  }

  @Post('join-session')
  join(@Body() data: any) {
    return this.client.send('poker.join.session', data).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('join-session-code')
  joinByCode(@Body() data: any) {
    return this.client.send('poker.join.session.code', data).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('ping')
  ping() {
    console.log('Pinging...');
    return 'pong';
  }
}
