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
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, catchError } from 'rxjs';
import { Response, Request } from 'express';

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

      const { accessToken, refreshToken } = result;

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res
        .status(HttpStatus.OK)
        .json({ data: result.data, accessToken, refreshToken });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error, message: 'Invalid credentials' });
    }
  }
  @UseGuards(AuthGuard)
  @Get('verify-token')
  verifyToken(@User() user: UserInterface) {
    return { user };
  }

  @UseGuards(AuthGuard)
  @Get('profile/:id')
  async profile(@Param('id') id: string) {
    const profile = await firstValueFrom(
      this.client.send('auth.get.profile', id).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
    if (!profile) {
      throw new RpcException('User not found');
    }
    return profile;
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });

    return res.status(HttpStatus.OK).json({ success: true });
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @Post('refresh-token')
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    try {
      const refreshToken =
        request.cookies?.refreshToken || request.body.refreshToken;
      if (!refreshToken) {
        throw new UnauthorizedException('No se encontró el refresh token');
      }

      const tokens = await firstValueFrom(
        this.client.send('auth.refresh.token', refreshToken),
      );

      const { accessToken } = tokens;

      response.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000,
        sameSite: 'lax',
      });

      return response.status(HttpStatus.OK).json(tokens);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
