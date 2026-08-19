import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private config: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
  ) {}

  async onModuleInit() {
    const existingAdmin = await this.userRepo.findOne({ where: { role: UserRole.ADMIN } });
    if (existingAdmin) {
      return;
    }

    const email = this.config.get<string>('ADMIN_EMAIL', 'admin@mithaq.local');
    const password = this.config.get<string>('ADMIN_PASSWORD', 'admin123');
    const hashed = await bcrypt.hash(password, 12);

    const admin = await this.userRepo.save(
      this.userRepo.create({
        email,
        password: hashed,
        role: UserRole.ADMIN,
        isVerified: true,
        isActive: true,
      }),
    );

    await this.profileRepo.save(
      this.profileRepo.create({
        userId: admin.id,
        displayName: 'Mithaq Admin',
      }),
    );

    this.logger.log(`Seeded admin user: ${email}`);
  }
}
