import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BacklogModule } from './backlog/backlog.module';
import { ChannelsModule } from './channels/channels.module';
import { EpicsModule } from './epics/epics.module';
import { IssuesModule } from './issues/issues.module';
import { PokerModule } from './poker/poker.module';
import { ProjectsModule } from './projects/projects.module';
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';
import { SprintsModule } from './sprints/sprints.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    AuthModule,
    PokerModule,
    UsersModule,
    TeamsModule,
    ChannelsModule,
    ProjectsModule,
    IssuesModule,
    EpicsModule,
    BacklogModule,
    SprintsModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 3000,
          limit: 3,
        },
      ],
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
