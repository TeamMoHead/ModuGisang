import { Challenges } from 'src/challenges/challenges.entity';
import { Users } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  _id: number;

  @ManyToOne(() => Users, (user) => user.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // 추가
  user: Users;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Challenges, (challenge) => challenge.attendances)
  @JoinColumn({ name: 'challenge_id' }) // 추가
  challenge: Challenges;

  @Column({ name: 'challenge_id' })
  challengeId: number;

  @Column()
  date: Date;

  @Column()
  score: number;
}
