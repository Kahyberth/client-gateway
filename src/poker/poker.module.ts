import { Module } from '@nestjs/common';
import { PokerController } from './poker.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '../common/envs/envs';
import { NATS_SERVICE } from '../common/enums/service.enums';

@Module({
  controllers: [PokerController],
  providers: [],
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
