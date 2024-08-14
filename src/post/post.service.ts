import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PostDto } from './dto/post.dto';
import { Post } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prismaservice: PrismaService) {}

  addPost = async (
    iduser: number,
    data: PostDto,
    image: { nameImage: string; pathImage: string },
  ): Promise<Post> => {
    try {
      const user = await this.prismaservice.user.findUnique({
        where: {
          id: iduser,
        },
      });
      if (!user) {
        throw new HttpException(
          { message: 'Tài Khoản Không Tồn Tại' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const post = await this.prismaservice.post.create({
        data: {
          title: data.title,
          summary: data.summary,
          content: data.content,
          ownerId: iduser,
          nameImage: image.nameImage,
          pathImage: image.pathImage,
          statuspostid: data.statuspost,
        },
      });
      if (!post) {
        throw new HttpException(
          { message: 'Thêm bài viết không thành công' },
          HttpStatus.BAD_REQUEST,
        );
      }
      return post;
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  };

  updatePost = async (
    iduser: number,
    id: number,
    data: PostDto,
    image: { nameImage: string; pathImage: string },
  ): Promise<Post> => {
    try {
      const user = await this.prismaservice.user.findUnique({
        where: {
          id: iduser,
        },
      });
      if (!user) {
        throw new HttpException(
          { message: 'Tài Khoản Không Tồn Tại' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const post = await this.prismaservice.post.update({
        where: {
          id: id,
        },
        data: {
          title: data.title,
          summary: data.summary,
          content: data.content,
          ownerId: iduser,
          nameImage: image.nameImage,
          pathImage: image.pathImage,
        },
      });
      if (!post) {
        throw new HttpException(
          { message: `cập nhật bài viết ${id} không thành công` },
          HttpStatus.BAD_REQUEST,
        );
      }
      return post;
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  };
  deletePost = async (iduser: number, id: number): Promise<Post> => {
    try {
      const user = await this.prismaservice.user.findUnique({
        where: {
          id: iduser,
        },
      });
      if (!user) {
        throw new HttpException(
          { message: 'Tài Khoản Không Tồn Tại' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const post = await this.prismaservice.post.delete({
        where: {
          ownerId: iduser,
          id: id,
        },
      });
      if (!post) {
        throw new HttpException(
          { message: `Xóa bài viết ${id} không thành công` },
          HttpStatus.BAD_REQUEST,
        );
      }
      return post;
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  };

  viewAllPostbyUser = async (idUser: number): Promise<any> => {
    try {
      const user = await this.prismaservice.user.findUnique({
        where: {
          id: idUser,
          status: 0,
        },
      });
      if (!user) {
        throw new HttpException(
          { message: 'Tài Khoản Không Tồn Tại' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const post = await this.prismaservice.post.findMany({
        where: {
          ownerId: idUser,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
      return post;
    } catch (error) {}
  };
}