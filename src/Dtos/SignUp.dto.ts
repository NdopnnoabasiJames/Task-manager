import { IsString, IsNotEmpty, IsEmail, IsOptional, IsIn, Length } from 'class-validator';

export class CreateUserDto {
  @IsString({message:"Username must be a string"})
  @IsNotEmpty()
  @Length(3, 15, {message:"Username must be in a range of 3 to 15 characters"})
  username: string;

  @IsEmail({},{message:"Please enter a valid email address"})
  email: string;

  @IsString()
  @Length(3, 15, {message:"Password must be in a range of 3 to 15 characters"})
  password: string;

  @IsOptional()
  @IsIn(['admin', 'member'])
  role: string;

}
