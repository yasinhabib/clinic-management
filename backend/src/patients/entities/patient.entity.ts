import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Appointment } from '../../appointments/entities/appointment.entity';

export enum Gender {
  L = 'L',
  P = 'P',
}

registerEnumType(Gender, {
  name: 'Gender',
});

@ObjectType()
@Entity('patients')
export class Patient {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  kode_pasien: string;

  @Field()
  @Column()
  nama_lengkap: string;

  @Field()
  @Column()
  umur: number;

  @Field(() => Gender)
  @Column({
    type: 'text',
  })
  jenis_kelamin: Gender;

  @Field()
  @Column()
  no_telp: string;

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

  @Field(() => [Appointment], { nullable: true })
  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];
}