import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/common/enums/service.enums';

import { envs } from 'src/common/envs/envs';
import { ProjectsController } from './projects.controller';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Module({
  controllers: [ProjectsController],
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
export class ProjectsModule {}
