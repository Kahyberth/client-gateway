import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/common/nats.interface';
import { AuthGuard } from './guards/auth.guard';
import { envs } from 'src/common/envs/envs';

@Module({
  controllers: [AuthController],
  providers: [AuthGuard],
  imports: [
    ClientsModule.register([
      {
        name: NATS_SERVICE.NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: envs.NATS_SERVERS,
        },
      },
    ]),
  ],
  exports: [AuthGuard],
})
export class AuthModule {}
