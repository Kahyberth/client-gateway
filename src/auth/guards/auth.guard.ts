import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '../../common/nats.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromCookies(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { user, valid: isValidToken } = await firstValueFrom(
        this.client.send('auth.verify.user', token),
      );

      if (!isValidToken) {
        throw new UnauthorizedException();
      }

      request['user'] = user;
      request['accessToken'] = token;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    return request.cookies?.['accessToken'];
  }
}
