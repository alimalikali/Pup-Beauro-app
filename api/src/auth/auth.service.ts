import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ProfilesService } from '../profiles/profiles.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private profiles: ProfilesService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.users.findByEmail(email);
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 12);
    const user = await this.users.create({
      email,
      phone: dto.phone,
      password: hashed,
      gender: dto.gender,
    });

    await this.profiles.createForUser(user.id, {
      displayName: dto.displayName,
      city: dto.city,
    });

    const token = this.signToken(user.id, user.email);
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email.trim().toLowerCase());
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive) throw new UnauthorizedException('Account suspended');

    const token = this.signToken(user.id, user.email);
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }

  private signToken(userId: string, email: string) {
    return this.jwt.sign({ sub: userId, email });
  }
}
