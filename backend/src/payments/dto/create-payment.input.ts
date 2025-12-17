import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsEnum, IsDateString } from 'class-validator';
import { PaymentStatus } from '../entities/payment.entity';

@InputType()
export class CreatePaymentInput {
  @Field(() => Int)
  examinationId: number;

  @Field()
  @IsDateString()
  tanggal: string;

  @Field()
  @IsNumber()
  biaya_pemeriksaan: number;

  @Field()
  @IsNumber()
  biaya_obat: number;

  @Field(() => PaymentStatus, { nullable: true })
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}