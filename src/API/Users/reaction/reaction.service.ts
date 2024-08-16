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
    const check = await this.prismaservice.reactions.findUnique({
      where: {
        postId_ownerId: { postId: data.PostId, ownerId: id },
      },
    });
    if (check) {
      throw new HttpException(
        { message: 'Bạn đã chọn nó' },
        HttpStatus.BAD_REQUEST,
      );
    }

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
  updateReaction = async (id: number, data: ReactionPostDto): Promise<any> => {
    const reaction = await this.prismaservice.reactions.upsert({
      where: {
        postId_ownerId: { postId: data.PostId, ownerId: id },
      },
      update: {
        reactionType: data.reactintype,
      },
      create: {
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
  deletereaction = async (
    iduser: number,
    idpost: number,
  ): Promise<Reactions> => {
    const check = await this.prismaservice.reactions.findUnique({
      where: {
        postId_ownerId: { postId: idpost, ownerId: iduser },
      },
    });
    if (!check) {
      throw new HttpException(
        { message: 'Bạn chưa reaction bài này' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const deletereaction = await this.prismaservice.reactions.delete({
      where: {
        postId_ownerId: { postId: idpost, ownerId: iduser },
      },
    });
    if (!deletereaction) {
      throw new HttpException(
        { message: 'Xóa Thất Bại' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return deletereaction;
  };

  async getReactedPostsByUser(userId: number): Promise<any[]> {
    const reactedPosts = await this.prismaservice.reactions.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        postid: {
          select: {
            title: true,
            summary: true,
            content: true,
            createdAt: true,
          },
        },
        reactiontypes: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!reactedPosts || reactedPosts.length === 0) {
      throw new HttpException(
        { message: 'Người dùng này chưa phản hồi bài viết nào.' },
        HttpStatus.NOT_FOUND,
      );
    }

    return reactedPosts.map((reaction) => ({
      post: reaction.postid,
      reactionType: reaction.reactiontypes,
    }));
  }
}
