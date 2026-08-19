import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AdminService } from './admin.service';
import { VerificationStatus } from '../verification/entities/verification-doc.entity';

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
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() body: { status: VerificationStatus; note?: string },
  ) {
    return this.admin.reviewVerification(id, user.id, body.status, body.note);
  }

  @Get('users')
  getUsers() {
    return this.admin.getAllUsers();
  }

  @Put('users/:id/suspend')
  suspend(@Param('id') id: string) {
    return this.admin.suspendUser(id);
  }

  @Put('users/:id/unsuspend')
  unsuspend(@Param('id') id: string) {
    return this.admin.unsuspendUser(id);
  }
}
