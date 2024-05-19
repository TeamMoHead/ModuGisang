import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendance } from 'src/attendance/attendance.entity';
import { Invitations } from 'src/invitations/invitations.entity';
import { Streak } from './streak.entity';
import { Challenges } from 'src/challenges/challenges.entity';
import * as argon2 from 'argon2';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ name: 'challenge_id', nullable: true })
  challengeId: number;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column({ length: 32, name: 'user_name' })
  userName: string;

  @Column({ length: 255 })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @Column({ length: 300 })
  affirmation: string;

  @Column({ length: 255 })
  profile: string;

  @Column({ type: 'json' })
  medals: Medals;

  @Column({ name: 'current_refresh_token', length: 255, nullable: true })
  currentRefreshToken: string;

  @Column({ name: 'current_refresh_token_exp', nullable: true })
  currentRefreshTokenExp: Date;

  @OneToMany(() => Attendance, (attendance) => attendance.user, {
    cascade: true,
  })
  attendances: Attendance[];

  @OneToMany(() => Invitations, (invitation) => invitation.guest, {
    cascade: true,
  })
  invitations: Invitations[];

  @OneToOne(() => Streak, (streak) => streak.user, { cascade: true })
  streak: Streak;

  @OneToMany(() => Challenges, (challenge) => challenge.host, { cascade: true })
  hostedChallenges: Challenges[];
}

interface Medals {
  gold: number;
  silver: number;
  bronze: number;
}
