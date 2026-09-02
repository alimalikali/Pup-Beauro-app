import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationDoc, VerificationStatus } from './entities/verification-doc.entity';
import { UsersService } from '../users/users.service';
import { resolve, sep } from 'path';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(VerificationDoc) private repo: Repository<VerificationDoc>,
    private users: UsersService,
  ) {}

  async upload(userId: string, files: { cnicFront?: string; cnicBack?: string }) {
    const existing = await this.repo.findOne({ where: { userId } });
    if (existing) {
      Object.assign(existing, files, { status: VerificationStatus.PENDING });
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create({ userId, ...files }));
  }

  getStatus(userId: string) {
    return this.repo.findOne({ where: { userId } });
  }

  getPending() {
    return this.repo.find({
      where: { status: VerificationStatus.PENDING },
      relations: ['user', 'user.profile'],
      order: { createdAt: 'ASC' },
    });
  }

  async review(docId: string, adminId: string, status: VerificationStatus, note?: string) {
    const doc = await this.repo.findOne({ where: { id: docId } });
    if (!doc) throw new NotFoundException('Document not found');

    doc.status = status;
    doc.adminNote = note;
    doc.reviewedBy = adminId;
    doc.reviewedAt = new Date();
    await this.repo.save(doc);

    if (status === VerificationStatus.APPROVED) {
      await this.users.update(doc.userId, { isVerified: true, isActive: true });
    }

    return doc;
  }

  async getPrivateFile(docId: string, side: string) {
    if (side !== 'front' && side !== 'back') throw new NotFoundException('Document side not found');
    const doc = await this.repo.findOne({ where: { id: docId } });
    if (!doc) throw new NotFoundException('Document not found');
    const storedPath = side === 'front' ? doc.cnicFront : doc.cnicBack;
    if (!storedPath) throw new NotFoundException('Document file not found');

    const privateRoot = resolve(process.cwd(), 'uploads', 'cnic');
    const filePath = resolve(process.cwd(), storedPath);
    if (!filePath.startsWith(`${privateRoot}${sep}`)) throw new ForbiddenException('Invalid document path');
    return filePath;
  }
}
