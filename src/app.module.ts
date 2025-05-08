import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { IssuesModule } from './auth/issues/issues.module';
import { BacklogModule } from './backlog/backlog.module';
import { ChannelsModule } from './channels/channels.module';
import { EpicsModule } from './epics/epics.module';
import { PokerModule } from './poker/poker.module';
import { ProjectsModule } from './projects/projects.module';
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
