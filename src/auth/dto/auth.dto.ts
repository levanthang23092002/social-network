import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
export class RegisterDto {
  @IsNotEmpty()
  name: string;
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
  phone: string;
  @IsEmail()
  email: string;
  @MinLength(6)
  password: string;
  status: number;
}
export class LoginDto {
  @IsEmail()
  email: string;
  @MinLength(6)
  password: string;
}
