import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  UseGuards,
  Res,
  HttpStatus,
  Query,
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

      return res.status(HttpStatus.OK).json({ success: true });
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
}
