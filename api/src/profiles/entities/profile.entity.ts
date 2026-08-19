import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  sect: string;

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  profession: string;

  @Column({ nullable: true })
  familyType: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'text', nullable: true })
  purposeStatement: string;

  // pgvector column — run: CREATE EXTENSION IF NOT EXISTS vector;
  @Column({ type: 'text', nullable: true, comment: 'JSON array of 768 floats from Gemini text-embedding-004' })
  purposeEmbeddingRaw: string;

  @Column({ type: 'simple-array', nullable: true })
  lifeTags: string[];

  @Column({ default: 50 })
  priorityDeen: number;

  @Column({ default: 50 })
  priorityEducation: number;

  @Column({ default: 50 })
  priorityCareer: number;

  @Column({ default: 50 })
  priorityFamily: number;

  @Column({ default: 50 })
  priorityLocation: number;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: 0 })
  profileViews: number;

  @Column({ nullable: true })
  waliEmail: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get completeness(): number {
    const fields = [
      this.displayName, this.age, this.city, this.education,
      this.profession, this.purposeStatement, this.bio,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }
}
