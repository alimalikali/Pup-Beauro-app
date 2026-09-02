import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid") id: string;
  @Column() userId: string;
  @Column() type: string;
  @Column() title: string;
  @Column({ type: "text" }) body: string;
  @Column({ type: "jsonb", default: {} }) data: Record<string, unknown>;
  @Column({ default: false }) isRead: boolean;
  @CreateDateColumn() createdAt: Date;
}
