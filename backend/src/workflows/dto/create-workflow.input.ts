import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateWorkflowInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  label: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  url_path: string;
}