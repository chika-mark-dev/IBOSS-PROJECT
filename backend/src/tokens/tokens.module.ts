import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshToken } from './entities/refresh-token.entity';
import { TokensService } from './tokens.service';
import { CLOCK, SystemClock } from './clocks';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.register({}),
    UsersModule,
  ],
  providers: [TokensService, { provide: CLOCK, useClass: SystemClock }],
  exports: [TokensService],
})
export class TokensModule {}
