import { Controller, Post, Body, Inject } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { NATS_SERVICE } from 'src/common/enums/service.enums';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LoginDto } from './dto/login-auth.dto';
import { catchError } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.client.send('register', createAuthDto).pipe(
      catchError((err) => {
        console.log('Error :D', err);
        throw new RpcException(err);
      }),
    );
  }

  @Post('login')
  login(@Body() login: LoginDto) {
    return this.client.send('login', login).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
