import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

@InputType()
export class CreateMedicineInput {
  @Field(() => Int)
  examinationId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  nama: string;

  @Field()
  @IsNumber()
  harga: number;

  @Field(() => Int)
  jumlah: number;
}