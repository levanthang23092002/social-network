import { IsNotEmpty } from 'class-validator';
export class PostDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  summary: string;
  content: string;
}
