import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { MatchingModule } from './matching/matching.module';
import { ChatModule } from './chat/chat.module';
import { VerificationModule } from './verification/verification.module';
import { EmbeddingModule } from './embedding/embedding.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';
import { SafetyModule } from './safety/safety.module';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters');
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || 'mithaq',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: false,
    }),
    AuthModule,
    UsersModule,
    ProfilesModule,
    MatchingModule,
    ChatModule,
    VerificationModule,
    EmbeddingModule,
    AdminModule,
    HealthModule,
    SafetyModule,
  ],
})
export class AppModule {}
