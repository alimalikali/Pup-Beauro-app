import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Favorite } from "./entities/favorite.entity";
import { Block } from "./entities/block.entity";
import { Report, ReportStatus } from "./entities/report.entity";
import { Notification } from "./entities/notification.entity";
import { ReportUserDto } from "./dto/report.dto";
import { UsersService } from "../users/users.service";
@Injectable()
export class SafetyService {
  constructor(
    @InjectRepository(Favorite) private favorites: Repository<Favorite>,
    @InjectRepository(Block) private blocks: Repository<Block>,
    @InjectRepository(Report) private reports: Repository<Report>,
    @InjectRepository(Notification)
    private notifications: Repository<Notification>,
    private users: UsersService,
  ) {}
  listFavorites(userId: string) {
    return this.favorites.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }
  async favorite(userId: string, profileUserId: string) {
    this.assertOther(userId, profileUserId);
    await this.assertTargetExists(profileUserId);
    await this.favorites.upsert({ userId, profileUserId }, [
      "userId",
      "profileUserId",
    ]);
    return { saved: true };
  }
  async unfavorite(userId: string, profileUserId: string) {
    await this.favorites.delete({ userId, profileUserId });
    return { saved: false };
  }
  listBlocks(userId: string) {
    return this.blocks.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }
  async block(userId: string, blockedUserId: string) {
    this.assertOther(userId, blockedUserId);
    await this.assertTargetExists(blockedUserId);
    await this.blocks.upsert({ userId, blockedUserId }, [
      "userId",
      "blockedUserId",
    ]);
    return { blocked: true };
  }
  async unblock(userId: string, blockedUserId: string) {
    await this.blocks.delete({ userId, blockedUserId });
    return { blocked: false };
  }
  async report(userId: string, dto: ReportUserDto) {
    this.assertOther(userId, dto.reportedUserId);
    await this.assertTargetExists(dto.reportedUserId);
    return this.reports.save(
      this.reports.create({ reporterId: userId, ...dto }),
    );
  }
  listReports() {
    return this.reports.find({ order: { createdAt: "DESC" }, take: 200 });
  }
  async reviewReport(
    id: string,
    adminId: string,
    status: ReportStatus,
    adminNote?: string,
  ) {
    const report = await this.reports.findOne({ where: { id } });
    if (!report) throw new NotFoundException("Report not found");
    report.status = status;
    report.reviewedBy = adminId;
    report.adminNote = adminNote;
    return this.reports.save(report);
  }
  listNotifications(userId: string) {
    return this.notifications.find({
      where: { userId },
      order: { createdAt: "DESC" },
      take: 50,
    });
  }
  async readNotification(userId: string, id: string) {
    await this.notifications.update({ id, userId }, { isRead: true });
    return { read: true };
  }
  private assertOther(userId: string, targetId: string) {
    if (userId === targetId)
      throw new BadRequestException(
        "You cannot perform this action on yourself",
      );
  }
  private async assertTargetExists(targetId: string) {
    const target = await this.users.findById(targetId);
    if (!target || !target.isActive) throw new NotFoundException("Profile not found");
  }
}
