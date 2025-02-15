import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PokerModule } from './poker/poker.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [AuthModule, PokerModule, UsersModule, TeamsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
