import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTrainingDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 255)
  subjectName: string;

  @IsNotEmpty({ each: true })
  @IsArray()
  teacherNames: [];
}
