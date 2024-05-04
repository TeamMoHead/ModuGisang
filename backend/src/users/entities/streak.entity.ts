import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Streak {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, user => user.streak)
  @JoinColumn({name: "user_id"}) // 추가
  user: Users;
  
  @Column({name : "user_id"})
  userId : number;

  @Column({name:"current_streak"})
  currentStreak: number;

  @Column({name:"last_active_date"})
  lastActiveDate: Date;
}
