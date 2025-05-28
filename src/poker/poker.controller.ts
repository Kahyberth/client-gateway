import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { catchError } from 'rxjs';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { NATS_SERVICE } from 'src/common/nats.interface';
import { CreatePokerDto } from './dto/create-poker.dto';
import { EstimationDto } from './dto/estimation.dto';
import { ValidateSession } from './dto/validate-session.dto';

@ApiTags('Planning Poker')
@Controller('poker')
export class PokerController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @UseGuards(AuthGuard)
  @Post('create-session')
  create(@Body() createPokerDto: CreatePokerDto) {
    console.log('Data received:', createPokerDto);
    return this.client.send('poker.create.session', createPokerDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('all-sessions')
  getAllRooms() {
    return this.client.send('poker.get.all.session', {}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  //MagicLink
  @Post('magic-link')
  magicLink(@Body() data: any) {
    return this.client.send('poker.join.magic.link', data).pipe(
      catchError((err) => {
        console.error('Error from microservice:', err);
        throw new BadRequestException({
          message: err?.error || 'An error occurred',
          statusCode: err?.code || 400,
        });
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Post('ai-estimation')
  aiEstimation(@Body() data: EstimationDto) {
    return this.client.send('poker.ai.estimation', data).pipe(
      catchError((err) => {
        console.error('Error from microservice:', err);
        throw new BadRequestException({
          message: err?.error || 'An error occurred',
          statusCode: err?.code || 400,
        });
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('session-details')
  getSessionDetails(@Query('session') id: string) {
    console.log('Data received:', id);
    return this.client.send('poker.get.session', id).pipe(
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
