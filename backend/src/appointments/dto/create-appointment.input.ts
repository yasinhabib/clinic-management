import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

@InputType()
export class CreateAppointmentInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  patientId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  tanggal?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  waktu?: string;

  @Field(() => AppointmentStatus, { nullable: true })
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}