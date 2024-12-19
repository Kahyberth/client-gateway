import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PokerModule } from './poker/poker.module';

@Module({
  imports: [AuthModule, PokerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
