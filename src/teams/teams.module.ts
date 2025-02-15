import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/common/enums/service.enums';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Module({
  controllers: [TeamsController],
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
})
export class TeamsModule {}
