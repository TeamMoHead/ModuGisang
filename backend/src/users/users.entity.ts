import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as argon2 from 'argon2';

@Entity('Users')
export class UsersEntity{
    @PrimaryGeneratedColumn()
    _id:number;

    @Column({unique:true})
    email:string;

    @Column({length:32})
    userName:string;

    @Column()
    password:string;

    @BeforeInsert()
    async hashPassword(){
        this.password = await argon2.hash(this.password);
    }

    @Column()
    affirmation:string;

    @Column()
    profile:string;

    @Column({type:'json'})
    medals: Medals;

    @Column({name:"current_refresh_token",nullable:true})
    currentRefreshToken: string;

    @Column({name:"current_refresh_token_exp",nullable:true})
    currentRefreshTokenExp:Date;

}
interface Medals{
    gold:number;
    silver:number;
    bronze:number;
}





