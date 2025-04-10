import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PokerModule } from './poker/poker.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { ChannelsModule } from './channels/channels.module';


@Module({
  imports: [AuthModule, PokerModule, UsersModule, TeamsModule, ChannelsModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}
