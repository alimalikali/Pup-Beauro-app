import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { VerificationStatus } from '../../verification/entities/verification-doc.entity';
import { ReportStatus } from '../../safety/entities/report.entity';

export class ReviewVerificationDto {
  @IsEnum(VerificationStatus)
  status: VerificationStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}

export class ReviewReportDto {
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
