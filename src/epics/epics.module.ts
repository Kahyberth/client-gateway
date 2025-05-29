import { Module } from '@nestjs/common';
import { EpicsController } from './epics.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from '../common/nats.interface';
import { envs } from '../common/envs/envs';

@Module({
  controllers: [EpicsController],
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
  exports: [],
})
export class EpicsModule {}
