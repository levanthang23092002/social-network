import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  IdTypeReaction,
  PostPaginationResType,
  PostSearchType,
  UserPaginationResType,
  UserSearchType,
} from './dto/view.dto';
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

  filtertypereacion = async (): Promise<any> => {
    return '1';
  };

  fillterReactedPostsByUser = async (
    idreaction: IdTypeReaction,
    idpost: number,
  ): Promise<any[]> => {
    const whereClause: any = {
      postId: idpost,
    };

    // Nếu người dùng cung cấp idreaction.typeReaction, thêm điều kiện reactionType vào whereClause
    if (idreaction.typeReaction) {
      whereClause.reactionType = Number(idreaction.typeReaction);
    }
    const reactedPosts = await this.prismaservice.reactions.findMany({
      where: whereClause,
      select: {
        owner: {
          select: {
            id: true,
            name: true,
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
        { message: 'Chưa có Người dùng nào có phản ứng này với bài viết này.' },
        HttpStatus.NOT_FOUND,
      );
    }

    return reactedPosts.map((reaction) => ({
      name: reaction.owner.name,
      id: reaction.owner.id,
      type: reaction.reactiontypes.name,
    }));
  };
}
