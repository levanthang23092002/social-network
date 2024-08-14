import { IsNotEmpty } from 'class-validator';
export class StatusDto {
  @IsNotEmpty()
  name: string;
  description: string;
}
