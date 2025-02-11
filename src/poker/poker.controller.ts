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
import { ValidateSession } from './dto/validate-session.dto';

@Controller('poker')
export class PokerController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('create-session')
  create(@Body() createPokerDto: CreatePokerDto) {
    console.log('Data received:', createPokerDto);
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

  @Post('validate-session')
  verifyUser(@Body() data: ValidateSession) {
    console.log('Data received:', data);
    return this.client.send('poker.validate.session', data).pipe(
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
        console.error('Error from microservice:', err);
        throw new BadRequestException({
          message: err?.error || 'An error occurred',
          statusCode: err?.code || 400,
        });
      }),
    );
  }

  @Post('join-session-code')
  joinByCode(@Body() data: any) {
    return this.client.send('poker.join.session.code', data).pipe(
      catchError((err) => {
        console.error('Error from microservice:', err);
        throw new BadRequestException({
          message: err?.error || 'An error occurred',
          statusCode: err?.code || 400,
        });
      }),
    );
  }

  @Get('stories')
  findAll() {
    return [
      {
        id: 1,
        title: 'Implement user authentication',
        description: 'As a user, I want to be able to securely log in ...',
        priority: 'High',
      },
      {
        id: 2,
        title: 'Create dashboard layout',
        description: 'As a user, I want to see a clear overview ...',
        priority: 'Medium',
      },
      {
        id: 3,
        title: 'Login page design',
        description: 'As a user, I want to see a beautiful login page ...',
        priority: 'Low',
      },
      {
        id: 4,
        title: 'Manage user roles',
        description: 'As an admin, I want to be able to manage user roles ...',
        priority: 'High',
      },
    ];
  }

  @Get('ping')
  ping() {
    console.log('Pinging...');
    return 'pong';
  }
}
