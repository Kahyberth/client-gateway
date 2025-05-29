import { Module } from '@nestjs/common';
import { PokerController } from './poker.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from '../common/nats.interface';
import { AuthGuard } from '../auth/guards/auth.guard';
import { envs } from '../common/envs/envs';

@Module({
  controllers: [PokerController],
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
})
export class PokerModule {}
