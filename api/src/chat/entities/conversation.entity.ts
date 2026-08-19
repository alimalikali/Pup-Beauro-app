import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToOne, JoinColumn, OneToMany, CreateDateColumn,
} from 'typeorm';
import { Match } from '../../matching/entities/match.entity';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @OneToOne(() => Match)
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @Column({ nullable: true })
  waliEmail: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Message, (m) => m.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;
}
