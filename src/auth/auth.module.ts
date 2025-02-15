import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/common/enums/service.enums';
import { AuthGuard } from './guards/auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthGuard],
  imports: [
    ClientsModule.register([
      {
        name: NATS_SERVICE.NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        },
      },
    ]),
  ],
  exports: [AuthGuard],
})
export class AuthModule {}
