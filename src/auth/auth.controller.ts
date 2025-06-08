import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { catchError, firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from '../common/nats.interface';
import { User } from './decorators';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserInterface } from './interfaces/user.interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'A new user was created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Duplicate/Incomplete Values' })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.client.send('auth.register.user', createAuthDto).pipe(
      catchError((err) => {
        throw new BadRequestException(err);
      }),
    );
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'The user has entered the data successfully.',
  })
  @ApiResponse({ status: 400, description: 'Incomplete Values' })
  async login(@Body() login: LoginDto, @Res() res: Response) {
    try {
      const result = await firstValueFrom(
        this.client.send('auth.login.user', login).pipe(
          catchError((err) => {
            throw new BadRequestException(err);
          }),
        ),
      );
      const EIGHT_DAYS = 8 * 24 * 60 * 60 * 1000;
      const { accessToken, refreshToken } = result;

      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: EIGHT_DAYS,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
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
  @ApiResponse({ status: 200, description: 'Token successfully verified' })
  @ApiResponse({
    status: 400,
    description: 'The token has expired or is invalid.',
  })
  verifyToken(@User() user: UserInterface) {
    return { user };
  }

  @UseGuards(AuthGuard)
  @Get('profile/:id')
  @ApiResponse({
    status: 200,
    description: 'Profile information successfully uploaded',
  })
  @ApiResponse({
    status: 400,
    description: 'The ID does not exist or has expired.',
  })
  async profile(@Param('id') id: string) {
    const profile = await firstValueFrom(
      this.client.send('auth.get.profile', id).pipe(
        catchError((err) => {
          throw new BadRequestException(err);
        }),
      ),
    );
    if (!profile) {
      throw new BadRequestException('User not found');
    }
    return profile;
  }

  @Post('logout')
  @ApiResponse({
    status: 200,
    description: 'User has successfully closed session',
  })
  @ApiResponse({
    status: 400,
    description: 'Error when trying to close the session',
  })
  logout(@Res() res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    });

    return res.status(HttpStatus.OK).json({ success: true });
  }

  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'Mail found successfully' })
  @ApiResponse({
    status: 400,
    description: 'The email provided does not exist or is invalid.',
  })
  @Get('find/:email')
  async findUserByEmail(@Param('email') email: string) {
    if (!email) throw new BadRequestException('Email is required');

    const user = await firstValueFrom(
      this.client.send('auth.find.user', email).pipe(
        catchError((err) => {
          throw new BadRequestException(err);
        }),
      ),
    );
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  @UseGuards(AuthGuard)
  @Get('find/user/:id')
  @ApiResponse({ status: 200, description: 'User successfully found' })
  @ApiResponse({
    status: 400,
    description: 'The user id provided does not exist or is invalid.',
  })
  async findUserById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Id is required');
    console.log('ID:', id);
    const user = await firstValueFrom(
      this.client.send('auth.find.user.by.id', id).pipe(
        catchError((err) => {
          throw new BadRequestException(err);
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
  @ApiResponse({ status: 200, description: 'The token provided is valid' })
  @ApiResponse({
    status: 400,
    description: 'The token does not exist or has expired.',
  })
  async findUser(@Param('token') token: string) {
    token = token.split('=')[1];
    const user = await firstValueFrom(
      this.client.send('auth.get.user', token).pipe(
        catchError((err) => {
          throw new BadRequestException(err);
        }),
      ),
    );
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  @Post('refresh-token')
  @ApiResponse({ status: 200, description: 'The token provided is valid' })
  @ApiResponse({
    status: 400,
    description: 'The token does not exist or has expired.',
  })
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    try {
      console.log('Se realizo la peticion de refresh token');

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
        sameSite: 'none',
      });

      return response.status(HttpStatus.OK).json(tokens);
    } catch {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(AuthGuard)
  @Patch('profile/update')
  @ApiResponse({ status: 200, description: 'Profile successfully updated' })
  @ApiResponse({ status: 400, description: 'Invalid profile data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    return this.client.send('auth.update.profile', updateProfileDto).pipe(
      catchError((err) => {
        throw new BadRequestException(err);
      }),
    );
  }
}
