import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Put, StreamableFile, UseGuards } from '@nestjs/common';
import { createReadStream } from 'fs';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AdminService } from './admin.service';
import { ReviewReportDto, ReviewVerificationDto } from './dto/admin-review.dto';

@Controller('admin')
@UseGuards(JwtGuard, AdminGuard)
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('stats')
  getStats() {
    return this.admin.getStats();
  }

  @Get('verifications')
  getPending() {
    return this.admin.getPendingVerifications();
  }

  @Put('verifications/:id')
  review(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() body: ReviewVerificationDto,
  ) {
    return this.admin.reviewVerification(id, user.id, body.status, body.note);
  }

  @Get('users')
  getUsers() {
    return this.admin.getAllUsers();
  }

  @Put('users/:id/suspend')
  suspend(@CurrentUser() admin: User, @Param('id', ParseUUIDPipe) id: string) {
    if (admin.id === id) throw new BadRequestException('Administrators cannot suspend themselves');
    return this.admin.suspendUser(id);
  }

  @Put('users/:id/unsuspend')
  unsuspend(@Param('id', ParseUUIDPipe) id: string) {
    return this.admin.unsuspendUser(id);
  }

  @Get('reports')
  getReports() {
    return this.admin.getReports();
  }

  @Put('reports/:id')
  reviewReport(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() admin: User,
    @Body() body: ReviewReportDto,
  ) {
    return this.admin.reviewReport(id, admin.id, body.status, body.note);
  }

  @Get('verification-files/:id/:side')
  async verificationFile(@Param('id', ParseUUIDPipe) id: string, @Param('side') side: string) {
    const filePath = await this.admin.getVerificationFile(id, side);
    return new StreamableFile(createReadStream(filePath), {
      disposition: 'inline',
      type: 'application/octet-stream',
    });
  }
}
