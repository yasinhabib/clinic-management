import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Medicine } from '../../medicines/entities/medicine.entity';
import { Payment } from '../../payments/entities/payment.entity';

@ObjectType()
@Entity('examinations')
export class Examination {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Appointment)
  @OneToOne(() => Appointment, (appointment) => appointment.examination)
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;

  @Column()
  appointmentId: number;

  @Field()
  @Column()
  nama_dokter: string;

  @Field()
  @Column('text')
  hasil_pemeriksaan: string;

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

  @Field(() => [Medicine], { nullable: true })
  @OneToMany(() => Medicine, (medicine) => medicine.examination)
  medicines: Medicine[];

  @Field(() => Payment, { nullable: true })
  @OneToMany(() => Payment, (payment) => payment.examination)
  payments: Payment[];
}