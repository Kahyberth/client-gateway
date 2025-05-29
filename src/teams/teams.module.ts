import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from '../common/nats.interface';
import { AuthGuard } from '../auth/guards/auth.guard';
import { envs } from '../common/envs/envs';

@Module({
  controllers: [TeamsController],
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
export class TeamsModule {}
