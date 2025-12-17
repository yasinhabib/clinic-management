import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEnum, IsDateString } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

@InputType()
export class CreateAppointmentInput {
  @Field(() => Int)
  patientId: number;

  @Field()
  @IsNotEmpty()
  @IsDateString()
  tanggal: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  waktu: string;

  @Field(() => AppointmentStatus, { nullable: true })
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}