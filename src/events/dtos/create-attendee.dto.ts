import { AttendeeAnswerEnum } from '../entities';
import { IsEnum } from 'class-validator';

export class CreateAttendeeDto {
  @IsEnum(AttendeeAnswerEnum)
  answer: AttendeeAnswerEnum;
}
