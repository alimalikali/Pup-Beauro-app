import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User, UserRole } from "../users/entities/user.entity";
import { Profile } from "../profiles/entities/profile.entity";

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
  ) {}

  async onModuleInit() {
    if (process.env.ADMIN_SEED_ENABLED !== "true") {
      return;
    }

    const existingAdmin = await this.userRepo.findOne({
      where: { role: UserRole.ADMIN },
    });
    if (existingAdmin) {
      return;
    }

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required when seeding is enabled");
    }
    if (password.length < 16) {
      throw new Error("ADMIN_PASSWORD must contain at least 16 characters");
    }
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
        displayName: "Mithaq Admin",
      }),
    );

    this.logger.log(`Seeded admin user: ${email}`);
  }
}
