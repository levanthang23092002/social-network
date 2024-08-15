import { IsNotEmpty } from 'class-validator';
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
