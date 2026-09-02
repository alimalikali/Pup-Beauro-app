import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { EmbeddingService } from '../embedding/embedding.service';
import { UpdateProfileDto, UpdatePurposeDto, UpdatePrioritiesDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private repo: Repository<Profile>,
    private embedding: EmbeddingService,
  ) {}

  async createForUser(userId: string, data: Partial<Profile>) {
    const profile = this.repo.create({ userId, ...data });
    return this.repo.save(profile);
  }

  async findByUserId(userId: string) {
    const profile = await this.repo.findOne({ where: { userId }, relations: ['user'] });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async update(userId: string, dto: UpdateProfileDto) {
    const profile = await this.findByUserId(userId);
    Object.assign(profile, dto);
    return this.repo.save(profile);
  }

  async updatePurpose(userId: string, dto: UpdatePurposeDto) {
    const profile = await this.findByUserId(userId);
    profile.purposeStatement = dto.purposeStatement;
    if (dto.lifeTags) profile.lifeTags = dto.lifeTags;

    try {
      const vec = await this.embedding.embed(dto.purposeStatement);
      profile.purposeEmbeddingRaw = JSON.stringify(vec);
    } catch {
      // Gemini unavailable — store statement, skip embedding
    }

    return this.repo.save(profile);
  }

  async updatePriorities(userId: string, dto: UpdatePrioritiesDto) {
    const profile = await this.findByUserId(userId);
    Object.assign(profile, dto);
    return this.repo.save(profile);
  }

  async publish(userId: string) {
    const profile = await this.findByUserId(userId);
    profile.isPublished = true;
    return this.repo.save(profile);
  }

  async getFeed(
    userId: string,
    limit = 10,
    excludeExistingMatches = true,
  ): Promise<{ profile: Profile; score: number }[]> {
    const myProfile = await this.findByUserId(userId);

    const query = this.repo.createQueryBuilder('profile')
      .innerJoinAndSelect('profile.user', 'user')
      .where('profile.isPublished = true')
      .andWhere('profile.userId != :userId', { userId })
      .andWhere('user.isActive = true')
      .andWhere('(user.gender IS NULL OR user.gender != :gender)', { gender: myProfile.user?.gender })
      .andWhere(`NOT EXISTS (
        SELECT 1 FROM blocks block
        WHERE (block."userId" = :userId AND block."blockedUserId" = profile."userId")
           OR (block."userId" = profile."userId" AND block."blockedUserId" = :userId)
      )`, { userId });

    if (excludeExistingMatches) {
      query.andWhere(`NOT EXISTS (
        SELECT 1 FROM matches existing_match
        WHERE (existing_match."userAId" = :userId AND existing_match."userBId" = profile."userId")
           OR (existing_match."userBId" = :userId AND existing_match."userAId" = profile."userId")
      )`, { userId });
    }

    const candidates = await query.take(100).getMany();

    const myVec = this.parseEmbedding(myProfile.purposeEmbeddingRaw);

    return candidates
      .map((p) => ({ profile: p, score: this.computeScore(p, myProfile, myVec) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private computeScore(candidate: Profile, me: Profile, myVec: number[] | null): number {
    let baseScore = 0.5;

    const theirVec = this.parseEmbedding(candidate.purposeEmbeddingRaw);
    if (myVec && theirVec && myVec.length === theirVec.length) {
      baseScore = this.cosineSimilarity(myVec, theirVec);
    }

    const priorityMatch = this.priorityScore(candidate, me);
    return Math.round((baseScore * 0.6 + priorityMatch * 0.4) * 100);
  }

  private parseEmbedding(value: string | null): number[] | null {
    if (!value) return null;
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) && parsed.every((item) => typeof item === 'number')
        ? parsed
        : null;
    } catch {
      return null;
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    return magA && magB ? dot / (magA * magB) : 0;
  }

  private priorityScore(candidate: Profile, me: Profile): number {
    const fields: Array<keyof Profile> = [
      'priorityDeen', 'priorityEducation', 'priorityCareer',
      'priorityFamily', 'priorityLocation',
    ];
    const diffs = fields.map((f) => Math.abs((me[f] as number) - (candidate[f] as number)));
    const avgDiff = diffs.reduce((s, d) => s + d, 0) / diffs.length;
    return 1 - avgDiff / 100;
  }

  incrementViews(profileId: string) {
    return this.repo.increment({ id: profileId }, 'profileViews', 1);
  }
}
