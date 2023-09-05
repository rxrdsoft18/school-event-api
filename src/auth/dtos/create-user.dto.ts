import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Field, InputType } from "@nestjs/graphql";
import { UserDoesNotExist } from "../validators/user-does-not-exist.constraint";

@InputType()
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  @UserDoesNotExist()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Field()
  @UserDoesNotExist()
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
