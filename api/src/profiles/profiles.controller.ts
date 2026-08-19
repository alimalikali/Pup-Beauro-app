import { Body, Controller, Get, Put, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto, UpdatePurposeDto, UpdatePrioritiesDto } from './dto/update-profile.dto';

@Controller('profile')
@UseGuards(JwtGuard)
export class ProfilesController {
  constructor(private profiles: ProfilesService) {}

  @Get()
  getMe(@CurrentUser() user: User) {
    return this.profiles.findByUserId(user.id);
  }

  @Put()
  update(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.profiles.update(user.id, dto);
  }

  @Post('purpose')
  updatePurpose(@CurrentUser() user: User, @Body() dto: UpdatePurposeDto) {
    return this.profiles.updatePurpose(user.id, dto);
  }

  @Post('priorities')
  updatePriorities(@CurrentUser() user: User, @Body() dto: UpdatePrioritiesDto) {
    return this.profiles.updatePriorities(user.id, dto);
  }

  @Post('publish')
  publish(@CurrentUser() user: User) {
    return this.profiles.publish(user.id);
  }

  @Get('completeness')
  async completeness(@CurrentUser() user: User) {
    const profile = await this.profiles.findByUserId(user.id);
    return { completeness: profile.completeness };
  }
}
