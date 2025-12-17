import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Examination } from '../../examinations/entities/examination.entity';

@ObjectType()
@Entity('medicines')
export class Medicine {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Examination)
  @ManyToOne(() => Examination)
  examination: Examination;

  @Column()
  examinationId: number;

  @Field()
  @Column()
  nama: string;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  harga: number;

  @Field()
  @Column()
  jumlah: number;

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