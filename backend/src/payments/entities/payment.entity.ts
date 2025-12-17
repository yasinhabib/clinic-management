import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Examination } from '../../examinations/entities/examination.entity';

export enum PaymentStatus {
  P = 'P',
  S = 'S',
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});

@ObjectType()
@Entity('payments')
export class Payment {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Examination)
  @ManyToOne(() => Examination)
  examination: Examination;

  @Column()
  examinationId: number;

  @Field()
  @Column('datetime')
  tanggal: Date;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  biaya_pemeriksaan: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  biaya_obat: number;

  @Field(() => PaymentStatus)
  @Column({
    type: 'text',
    default: PaymentStatus.P,
  })
  status: PaymentStatus;

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