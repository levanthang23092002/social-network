import { IsNotEmpty } from 'class-validator';
export class ReactionPostDto {
  @IsNotEmpty()
  PostId: number;
  @IsNotEmpty()
  reactintype: number;
}
export interface IdReaction {
  typeReaction?: number;
}
