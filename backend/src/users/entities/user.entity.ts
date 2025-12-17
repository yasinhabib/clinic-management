import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  username: string;

  @Column()
  password: string; // Tidak di-expose ke GraphQL

  @Field(() => UserRole)
  @Column({
    type: 'text',
    default: UserRole.STAFF,
  })
  role: UserRole;

  @Field()
  @CreateDateColumn()
  created_date: Date;

  @Field()
  @UpdateDateColumn()
  updated_date: Date;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;
}