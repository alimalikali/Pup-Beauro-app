import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { VerificationService } from '../verification/verification.service';
import { VerificationStatus } from '../verification/entities/verification-doc.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Match, MatchStatus } from '../matching/entities/match.entity';
import { Repository } from 'typeorm';
import { SafetyService } from '../safety/safety.service';
import { ReportStatus } from '../safety/entities/report.entity';

@Injectable()
export class AdminService {
  constructor(
    private users: UsersService,
    private verification: VerificationService,
    @InjectRepository(Match) private matchRepo: Repository<Match>,
    private safety: SafetyService,
  ) {}

  async getStats() {
    const allUsers = await this.users.findAll();
    const pending = await this.verification.getPending();
    const mutualMatches = await this.matchRepo.count({ where: { status: MatchStatus.MUTUAL } });

    return {
      totalUsers: allUsers.length,
      verifiedUsers: allUsers.filter((u) => u.isVerified).length,
      pendingVerifications: pending.length,
      activeMatches: mutualMatches,
    };
  }

  getPendingVerifications() {
    return this.verification.getPending();
  }

  reviewVerification(docId: string, adminId: string, status: VerificationStatus, note?: string) {
    return this.verification.review(docId, adminId, status, note);
  }

  getAllUsers() {
    return this.users.findAll();
  }

  suspendUser(userId: string) {
    return this.users.update(userId, { isActive: false });
  }

  unsuspendUser(userId: string) {
    return this.users.update(userId, { isActive: true });
  }

  getReports() {
    return this.safety.listReports();
  }

  reviewReport(
    reportId: string,
    adminId: string,
    status: ReportStatus,
    note?: string,
  ) {
    return this.safety.reviewReport(reportId, adminId, status, note);
  }

  getVerificationFile(documentId: string, side: string) {
    return this.verification.getPrivateFile(documentId, side);
  }
}
