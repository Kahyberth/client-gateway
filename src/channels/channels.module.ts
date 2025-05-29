import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from '../common/nats.interface';
import { envs } from '../common/envs/envs';

@Module({
  controllers: [ChannelsController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: NATS_SERVICE.NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          url: envs.NATS_SERVERS,
        },
      },
    ]),
  ],
  exports: [],
})
export class ChannelsModule {}
