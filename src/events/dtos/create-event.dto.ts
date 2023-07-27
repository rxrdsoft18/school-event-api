import { IsDateString, IsNotEmpty, Length } from "class-validator";

export class CreateEventDto {
  @IsNotEmpty()
  @Length(5, 255)
  name: string;

  @IsNotEmpty()
  @Length(5, 255)
  description: string;

  @IsNotEmpty()
  @IsDateString()
  when: string;

  @IsNotEmpty()
  @Length(5, 255)
  address: string;
}
