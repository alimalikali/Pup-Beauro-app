import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
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
    @Param('userId') toUserId: string,
    @Body() body: { score?: number },
  ) {
    return this.matching.expressInterest(user.id, toUserId, body.score ?? 0);
  }

  @Get('mutual')
  getMutual(@CurrentUser() user: User) {
    return this.matching.getMutualMatches(user.id);
  }

  @Put(':matchId/skip')
  skip(@CurrentUser() user: User, @Param('matchId') targetId: string) {
    return this.matching.skipMatch(user.id, targetId);
  }
}
