import {IsEmail, IsString, MaxLength, MinLength} from 'class-validator';

export default class CreateUserDto {
  @IsEmail({}, {message: 'email must be a valid address'})
  public email!: string;

  @MinLength(1, {message: 'Minimum name length is 1'})
  @MaxLength(15, {message: 'Maximum name length is 15'})
  public userName!: string;

  @IsString({message: 'password is required'})
  @MinLength(6, {message: 'Minimum password length is 1'})
  @MaxLength(12, {message: 'Maximum password length is 12'})
  public password!: string;
}
