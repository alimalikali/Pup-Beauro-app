import {
  Controller, Post, Get, UseGuards, UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { VerificationService } from './verification.service';

@Controller('verification')
@UseGuards(JwtGuard)
export class VerificationController {
  constructor(private verification: VerificationService) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'cnicFront', maxCount: 1 }, { name: 'cnicBack', maxCount: 1 }],
      {
        storage: diskStorage({
          destination: './uploads/cnic',
          filename: (_req, file, cb) => cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`),
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype)),
      },
    ),
  )
  upload(
    @CurrentUser() user: User,
    @UploadedFiles() files: { cnicFront?: Express.Multer.File[]; cnicBack?: Express.Multer.File[] },
  ) {
    return this.verification.upload(user.id, {
      cnicFront: files.cnicFront?.[0]?.path,
      cnicBack: files.cnicBack?.[0]?.path,
    });
  }

  @Get('status')
  getStatus(@CurrentUser() user: User) {
    return this.verification.getStatus(user.id);
  }
}
