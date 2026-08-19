import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum MatchStatus { PENDING = 'pending', MUTUAL = 'mutual', REJECTED = 'rejected' }

@Entity('matches')
@Unique(['userAId', 'userBId'])
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userAId: string;

  @Column()
  userBId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userAId' })
  userA: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userBId' })
  userB: User;

  @Column({ type: 'enum', enum: MatchStatus, default: MatchStatus.PENDING })
  status: MatchStatus;

  @Column({ type: 'float', nullable: true })
  compatScore: number;

  @Column()
  initiatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
