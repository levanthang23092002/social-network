import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PostDto } from './dto/post.dto';
import { Post } from '@prisma/client';
import { ParseIntPipe } from '@nestjs/common';

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
          statusId: 1,
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
      const post = await this.prismaservice.post.findMany({
        where: {
          ownerId: idUser,
          OR: [{ statusId: 1 }, { statusId: 2 }],
          approves: true,
        },
      });
      if (!post) {
        throw new HttpException(
          { message: 'Lỗi truy vấn' },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (post.length == 0) {
        throw new HttpException(
          { message: 'Không Tìm thấy bài viết nào' },
          HttpStatus.BAD_REQUEST,
        );
      }
      return post;
    } catch (error) {
      throw new NotFoundException(error);
    }
  };
}
