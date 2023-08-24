import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTeacher {
  @IsNotEmpty()
  @Field()
  name: string;
}
