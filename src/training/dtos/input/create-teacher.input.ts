import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Gender } from '../../object-types/school.types';

@InputType()
export class CreateTeacher {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  @Field(() => Gender)
  gender: Gender;
}
