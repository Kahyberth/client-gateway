import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/common/nats.interface';

import { envs } from 'src/common/envs/envs';
import { IssuesController } from './issues.controller';
import { AuthGuard } from 'src/auth/guards/auth.guard';

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
