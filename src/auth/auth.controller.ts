import { Controller, Post, Body, Inject, Get, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { CreateAuthDto } from './dto/create-auth.dto';
import { NATS_SERVICE } from 'src/common/enums/service.enums';
import { LoginDto } from './dto/login-auth.dto';
import { User, Token } from './decorators';
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
        console.log('Error :D', err);
        throw new RpcException(err);
      }),
    );
  }

  @Post('login')
  login(@Body() login: LoginDto) {
    return this.client.send('auth.login.user', login).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @UseGuards(AuthGuard)
  @Get('verify')
  verifyToken(@User() user: UserInterface, @Token() token: string) {
    return { user, token };
  }
}
