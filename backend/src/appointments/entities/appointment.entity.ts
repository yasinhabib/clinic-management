import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Patient } from '../../patients/entities/patient.entity';
import { Examination } from '../../examinations/entities/examination.entity';

export enum AppointmentStatus {
  P = 'P',
  S = 'S',
  C = 'C',
}

registerEnumType(AppointmentStatus, {
  name: 'AppointmentStatus',
});

@ObjectType()
@Entity('appointments')
export class Appointment {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Patient)
  @ManyToOne(() => Patient, (patient) => patient.appointments)
  patient: Patient;

  @Column()
  patientId: number;

  @Field()
  @Column('date')
  tanggal: string;

  @Field()
  @Column('time')
  waktu: string;

  @Field(() => AppointmentStatus)
  @Column({
    type: 'text',
    default: AppointmentStatus.P,
  })
  status: AppointmentStatus;

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

  @Field(() => [Examination], { nullable: true })
  @OneToMany(() => Examination, (examination) => examination.appointment)
  examinations: Examination[];
}