import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from "typeorm";
@Entity("blocks")
@Unique(["userId", "blockedUserId"])
export class Block {
  @PrimaryGeneratedColumn("uuid") id: string;
  @Column() userId: string;
  @Column() blockedUserId: string;
  @CreateDateColumn() createdAt: Date;
}
