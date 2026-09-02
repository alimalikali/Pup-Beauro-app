import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match, MatchStatus } from './entities/match.entity';
import { ProfilesService } from '../profiles/profiles.service';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(Match) private repo: Repository<Match>,
    private profiles: ProfilesService,
    private chat: ChatService,
  ) {}

  getFeed(userId: string) {
    return this.profiles.getFeed(userId);
  }

  async expressInterest(fromUserId: string, toUserId: string) {
    if (fromUserId === toUserId) throw new BadRequestException('Cannot match with yourself');

    const [a, b] = [fromUserId, toUserId].sort();
    let match = await this.repo.findOne({ where: { userAId: a, userBId: b } });

    const candidate = (await this.profiles.getFeed(fromUserId, 100, false)).find(
      (item) => item.profile.userId === toUserId,
    );
    if (!candidate) throw new BadRequestException('Profile is not available for matching');

    if (match) {
      if (match.status === MatchStatus.REJECTED) throw new BadRequestException('This introduction is closed');
      if (match.initiatedBy !== fromUserId) {
        match.status = MatchStatus.MUTUAL;
        await this.repo.save(match);
        await this.chat.getOrCreateConversation(match.id);
        return { mutual: true, match };
      }
      return { mutual: false, match };
    }

    match = this.repo.create({
      userAId: a, userBId: b,
      status: MatchStatus.PENDING,
      compatScore: candidate.score,
      initiatedBy: fromUserId,
    });

    await this.repo.save(match);
    return { mutual: false, match };
  }

  getMutualMatches(userId: string) {
    return this.repo.find({
      where: [
        { userAId: userId, status: MatchStatus.MUTUAL },
        { userBId: userId, status: MatchStatus.MUTUAL },
      ],
      relations: ['userA', 'userA.profile', 'userB', 'userB.profile'],
    });
  }

  skipMatch(userId: string, targetId: string) {
    const [a, b] = [userId, targetId].sort();
    return this.repo.upsert(
      { userAId: a, userBId: b, status: MatchStatus.REJECTED, initiatedBy: userId },
      ['userAId', 'userBId'],
    );
  }
}
