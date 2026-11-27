import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ExamsModule } from './exams/exams.module';
import { QuestionsModule } from './questions/questions.module';
import { SessionsModule } from './sessions/sessions.module';
import { GradingModule } from './grading/grading.module';
import { TimerModule } from './timer/timer.module';
import { CommonModule } from './common/common.module';
import { TokensModule } from './tokens/tokens.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        url: config.getOrThrow<string>(
          process.env.NODE_ENV === 'test'
            ? 'DATABASE_URL_TEST'
            : 'DATABASE_URL',
        ),
        ssl: true,
        autoLoadEntities: true,
        synchronize: config.get<string>('DB_SYNC') === 'true',
        namingStrategy: new SnakeNamingStrategy(),
        retryAttempts: 5,
        retryDelay: 3000,
        extra: { connectionTimeoutMillis: 15000 },
      }),
    }),
    UsersModule,
    AuthModule,
    ExamsModule,
    QuestionsModule,
    SessionsModule,
    GradingModule,
    TimerModule,
    CommonModule,
    TokensModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
