import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PokerModule } from './poker/poker.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, PokerModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
