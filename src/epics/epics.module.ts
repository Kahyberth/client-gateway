import { Module } from '@nestjs/common';
import { EpicsController } from './epics.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/common/nats.interface';

@Module({
  controllers: [EpicsController],
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
})
export class EpicsModule {}
