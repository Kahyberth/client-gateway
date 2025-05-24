import { Module } from '@nestjs/common';
import { SprintsController } from './sprints.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/common/enums/service.enums';

@Module({
  controllers: [SprintsController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: NATS_SERVICE.NATS_SERVICE,
        transport: Transport.NATS,
        options: { servers: ['nats://localhost:4222'] },
      },
    ]),
  ],
})
export class SprintsModule {}
