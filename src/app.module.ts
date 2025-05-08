import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PokerModule } from './poker/poker.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { ChannelsModule } from './channels/channels.module';
import { ProjectsModule } from './projects/projects.module';
import { IssuesModule } from './issues/issues.module';
import { EpicsModule } from './epics/epics.module';

@Module({
  imports: [
    AuthModule,
    PokerModule,
    UsersModule,
    TeamsModule,
    ChannelsModule,
    ProjectsModule,
    IssuesModule,
    EpicsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
