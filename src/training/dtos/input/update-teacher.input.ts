import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateTeacher } from './create-teacher.input';

@InputType()
export class UpdateTeacher extends PartialType(
  OmitType(CreateTeacher, ['gender']),
) {}
