import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from '../common/nats.interface';

import { envs } from '../common/envs/envs';
import { IssuesController } from './issues.controller';
import { AuthGuard } from '../auth/guards/auth.guard';

@Module({
  controllers: [IssuesController],
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
  exports: [],
})
export class IssuesModule {}
