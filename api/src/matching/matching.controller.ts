import { Controller, Get, Param, Post, Put, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { MatchingService } from './matching.service';

@Controller('matches')
@UseGuards(JwtGuard)
export class MatchingController {
  constructor(private matching: MatchingService) {}

  @Get('feed')
  getFeed(@CurrentUser() user: User) {
    return this.matching.getFeed(user.id);
  }

  @Post('interest/:userId')
  expressInterest(
    @CurrentUser() user: User,
    @Param('userId', ParseUUIDPipe) toUserId: string,
  ) {
    return this.matching.expressInterest(user.id, toUserId);
  }

  @Get('mutual')
  getMutual(@CurrentUser() user: User) {
    return this.matching.getMutualMatches(user.id);
  }

  @Put('skip/:userId')
  skip(@CurrentUser() user: User, @Param('userId', ParseUUIDPipe) targetId: string) {
    return this.matching.skipMatch(user.id, targetId);
  }
}
