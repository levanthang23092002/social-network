import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reactions } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ReactionPostDto } from './dto/reaction.dto';

@Injectable()
export class ReactionService {
  constructor(private prismaservice: PrismaService) {}

  addReaction = async (
    id: number,
    data: ReactionPostDto,
  ): Promise<Reactions> => {
    const reaction = await this.prismaservice.reactions.create({
      data: {
        postId: data.PostId,
        ownerId: id,
        reactionType: data.reactintype,
      },
    });
    if (!reaction) {
      throw new HttpException(
        { message: 'Lỗi truy vấn' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return reaction;
  };
  updateReaction = async (
    id: number,
    data: ReactionPostDto,
  ): Promise<Reactions> => {
    const reaction = await this.prismaservice.reactions.update({
      where: {
        postId: data.PostId,
        ownerId: id,
      },
      data: {
        reactionType: data.reactintype,
      },
    });
    if (!reaction) {
      throw new HttpException(
        { message: 'Lỗi truy vấn' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return reaction;
  };
}
