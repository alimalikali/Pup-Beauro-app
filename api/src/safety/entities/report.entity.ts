import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
export enum ReportStatus {
  OPEN = "open",
  REVIEWING = "reviewing",
  RESOLVED = "resolved",
  DISMISSED = "dismissed",
}
@Entity("reports")
export class Report {
  @PrimaryGeneratedColumn("uuid") id: string;
  @Column() reporterId: string;
  @Column() reportedUserId: string;
  @Column() category: string;
  @Column({ type: "text" }) details: string;
  @Column({ type: "enum", enum: ReportStatus, default: ReportStatus.OPEN })
  status: ReportStatus;
  @Column({ nullable: true }) adminNote: string;
  @Column({ nullable: true }) reviewedBy: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
