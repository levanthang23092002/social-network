import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(private prismaservice: PrismaService) {}
  addcomment = async (
    iduser: number,
    idpost: number,
    data: CommentDto,
  ): Promise<Comment> => {
    const comment = await this.prismaservice.comment.create({
      data: {
        ownerId: iduser,
        postId: idpost,
        content: data.content,
      },
    });
    if (!comment) {
      throw new HttpException(
        { message: 'comment bài viết không thành công' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return comment;
  };

  updatecomment = async (
    iduser: number,
    id: number,
    data: CommentDto,
  ): Promise<Comment> => {
    const comment = await this.prismaservice.comment.update({
      where: {
        ownerId: iduser,
        id: id,
      },
      data: {
        content: data.content,
      },
    });
    if (!comment) {
      throw new HttpException(
        { message: 'update commet bài viết không thành công' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return comment;
  };
  deletecomment = async (iduser: number, id: number): Promise<Comment> => {
    const comment = await this.prismaservice.comment.delete({
      where: {
        ownerId: iduser,
        id: id,
      },
    });
    if (!comment) {
      throw new HttpException(
        { message: 'detele commet bài viết không thành công' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return comment;
  };
}
