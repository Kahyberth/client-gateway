import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/common/enums/service.enums';

@Module({
  controllers: [ChannelsController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: NATS_SERVICE.NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          url: 'nats://localhost:4222',
        },
      }
    ])
  ]
})
export class ChannelsModule {}
