import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { Match, MatchStatus } from '../matching/entities/match.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation) private convRepo: Repository<Conversation>,
    @InjectRepository(Message) private msgRepo: Repository<Message>,
    @InjectRepository(Match) private matchRepo: Repository<Match>,
  ) {}

  async getOrCreateConversation(matchId: string): Promise<Conversation> {
    let conv = await this.convRepo.findOne({ where: { matchId } });
    if (!conv) {
      const match = await this.matchRepo.findOne({ where: { id: matchId } });
      if (!match || match.status !== MatchStatus.MUTUAL) {
        throw new ForbiddenException('Conversation requires mutual match');
      }
      conv = await this.convRepo.save(this.convRepo.create({ matchId }));
    }
    return conv;
  }

  async getConversations(userId: string) {
    return this.convRepo
      .createQueryBuilder('conv')
      .innerJoinAndSelect('conv.match', 'match')
      .leftJoinAndSelect('conv.messages', 'msg')
      .where('match.userAId = :uid OR match.userBId = :uid', { uid: userId })
      .orderBy('conv.createdAt', 'DESC')
      .getMany();
  }

  async getMessages(conversationId: string, userId: string) {
    const conv = await this.convRepo.findOne({
      where: { id: conversationId },
      relations: ['match'],
    });
    if (!conv) throw new NotFoundException('Conversation not found');

    const { userAId, userBId } = conv.match;
    if (userAId !== userId && userBId !== userId) throw new ForbiddenException();

    return this.msgRepo.find({
      where: { conversationId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async saveMessage(conversationId: string, senderId: string, content: string) {
    const msg = this.msgRepo.create({ conversationId, senderId, content });
    return this.msgRepo.save(msg);
  }

  async setWali(conversationId: string, waliEmail: string) {
    const result = await this.convRepo.update(conversationId, { waliEmail });
    if (!result.affected) throw new NotFoundException('Conversation not found');
    return result;
  }

  async markRead(conversationId: string, userId: string) {
    await this.getMessages(conversationId, userId);
    await this.msgRepo.update(
      { conversationId, isRead: false },
      { isRead: true },
    );
  }
}
