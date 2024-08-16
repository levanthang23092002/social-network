import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
export class StatusDto {
  @IsNotEmpty()
  name: string;
  description: string;
}

export class ReactionDto {
  @IsNotEmpty()
  name: string;
  description: string;
}

export class RegisterAdminDto {
  @IsNotEmpty()
  name: string;
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
  phone: string;
  @IsEmail()
  email: string;
  @MinLength(6)
  password: string;
  type: string;
}
