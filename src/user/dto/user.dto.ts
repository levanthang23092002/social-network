import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
export class UserDto {
  @IsNotEmpty()
  name: string;
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
  phone: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @MinLength(6)
  passwordCurrent: string;
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;
}
