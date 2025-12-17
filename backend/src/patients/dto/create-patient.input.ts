import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { Gender } from '../entities/patient.entity';

@InputType()
export class CreatePatientInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  nama_lengkap: string;

  @Field()
  @IsNumber()
  umur: number;

  @Field(() => Gender)
  @IsEnum(Gender)
  jenis_kelamin: Gender;

  @Field()
  @IsNotEmpty()
  @IsString()
  no_telp: string;
}