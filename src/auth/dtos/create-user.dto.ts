import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  lastName: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  age: number;
}
