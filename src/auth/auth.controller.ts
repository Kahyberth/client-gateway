import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  UseGuards,
  Res,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, catchError } from 'rxjs';
import { Response } from 'express';

import { CreateAuthDto } from './dto/create-auth.dto';
import { NATS_SERVICE } from 'src/common/enums/service.enums';
import { LoginDto } from './dto/login-auth.dto';
import { User } from './decorators';
import { UserInterface } from './interfaces/user.interfaces';
import { AuthGuard } from './guards/auth.guard';
import { CreateTeamDto } from './dto/create-team-dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.client.send('auth.register.user', createAuthDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('login')
  async login(@Body() login: LoginDto, @Res() res: Response) {
    try {
      const result = await firstValueFrom(
        this.client.send('auth.login.user', login).pipe(
          catchError((err) => {
            throw new RpcException(err);
          }),
        ),
      );

      const { token } = result;

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return res.status(HttpStatus.OK).json({ data: result.data, token });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error, message: 'Invalid credentials' });
    }
  }
  @UseGuards(AuthGuard)
  @Get('verify')
  verifyToken(@User() user: UserInterface) {
    return { user };
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
    });
    return res.status(HttpStatus.OK).json({ success: true });
  }

  @Get('find/:email')
  async findUserByEmail(@Param('email') email: string) {
    if (!email) throw new RpcException('Email is required');

    const user = await firstValueFrom(
      this.client.send('auth.find.user', email).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
    if (!user) {
      throw new RpcException('User not found');
    }
    return user;
  }

  @Get('find/user/:id')
  async findUserById(@Param('id') id: string) {
    if (!id) throw new RpcException('Id is required');

    const user = await firstValueFrom(
      this.client.send('auth.find.user.by.id', id).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
    if (!user) {
      throw new RpcException('User not found');
    }
    return user;
  }

  @Post('find/:token')
  async findUser(@Param('token') token: string) {
    token = token.split('=')[1];
    const user = await firstValueFrom(
      this.client.send('auth.get.user', token).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
    if (!user) {
      throw new RpcException('User not found');
    }
    return user;
  }

  //Teams

  @Post('create-team')
  async createTeam(@Body() team: CreateTeamDto) {
    const result = await firstValueFrom(
      this.client.send('auth.create.team', team).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
    return result;
  }

  @Get('get-all-teams')
  async getAllTeams() {
    const result = await firstValueFrom(
      this.client.send('auth.get.all.teams', {}).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
    return result;
  }
}
