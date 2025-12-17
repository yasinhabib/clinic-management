import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateExaminationInput {
  @Field(() => Int)
  appointmentId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  nama_dokter: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  hasil_pemeriksaan: string;
}