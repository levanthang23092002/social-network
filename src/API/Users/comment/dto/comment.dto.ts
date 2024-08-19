import { IsNotEmpty } from 'class-validator';

export class CommentDto {
  @IsNotEmpty()
  content: string;
}
