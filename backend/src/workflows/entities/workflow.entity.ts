import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('workflows')
export class Workflow {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  label: string;

  @Field()
  @Column()
  url_path: string;

  @Field()
  @Column()
  workflow_order: number;

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