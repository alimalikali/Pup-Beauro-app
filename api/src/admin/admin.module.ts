import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../matching/entities/match.entity';
import { User } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { VerificationModule } from '../verification/verification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, User, Profile]),
    UsersModule,
    VerificationModule,
  ],
  providers: [AdminService, SeedService],
  controllers: [AdminController],
})
export class AdminModule {}
