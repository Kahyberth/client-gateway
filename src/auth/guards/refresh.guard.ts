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
import { NATS_SERVICE } from 'src/common/enums/service.enums';

@Injectable()
export class RefreshToken implements CanActivate {
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
      const { accessToken, refreshToken } = await firstValueFrom(
        this.client.send('auth.refresh.token', token),
      );
      request['token'] = accessToken;
      request['refreshToken'] = refreshToken;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    return request.cookies?.['refreshToken'];
  }
}
