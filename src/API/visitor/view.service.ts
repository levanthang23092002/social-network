import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostPaginationResType, PostSearchType, UserPaginationResType, UserSearchType } from './dto/view.dto';
import { Post } from '@prisma/client';

@Injectable()
export class ViewService {
  constructor(private prismaservice: PrismaService) {}
  search = async (data: PostSearchType): Promise<PostPaginationResType> => {
    const per_page = Number(data.items_page_per) || 12;
    const page = Number(data.page) || 1;
    const search = data.search || '';
    const skip = page > 1 ? (page - 1) * per_page : 0;
    const posts = await this.prismaservice.post.findMany({
      take: per_page,
      skip,
      where: {
        OR: [
          { title: { contains: search } },
          { summary: { contains: search } },
          { content: { contains: search } },
        ],
        AND: [{ approves: true }],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prismaservice.post.count({
      where: {
        OR: [
          { title: { contains: search } },
          { summary: { contains: search } },
          { content: { contains: search } },
        ],
        AND: [{ approves: true }],
      },
    });
    return {
      data: posts,
      total: total,
      page: page,
      itemperpage: per_page,
    };
  };

  getdetai = async (id: number): Promise<Post> => {
    const post = await this.prismaservice.post.findUnique({
      where: {
        id: id,
      },
    });
    if (!post) {
      throw new HttpException(
        { message: 'Không tìm thấy người dùng' },
        HttpStatus.NOT_FOUND,
      );
    }
    return post;
  };
  searchUser = async (data: UserSearchType): Promise<UserPaginationResType> => {
    const per_page = Number(data.items_page_per) || 12;
    const page = Number(data.page) || 1;
    const search = data.search || '';
    const skip = page > 1 ? (page - 1) * per_page : 0;
    const users = await this.prismaservice.user.findMany({
      take: per_page,
      skip,
      where: {
        OR: [{ name: { contains: search } }, { email: { contains: search } }],
        AND: [{ status: true }],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prismaservice.post.count({
      where: {
        OR: [
          { title: { contains: search } },
          { summary: { contains: search } },
          { content: { contains: search } },
        ],
        AND: [{ approves: true }],
      },
    });
    return {
      data: users,
      total: total,
      page: page,
      itemperpage: per_page,
    };
  };
}
