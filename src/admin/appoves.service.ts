import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ApproveService {
  constructor(private prismaservice: PrismaService) {}
  ApprovePost = async (id: number): Promise<Post> => {
    try {
      const approves = await this.prismaservice.post.update({
        where: {
          id: id,
          approves: false,
        },
        data: {
          approves: true,
        },
      });

      if (!approves) {
        throw new HttpException(
          { message: `Không duyệt Được ${id} Post này` },
          HttpStatus.UNAUTHORIZED,
        );
      }
      return approves;
    } catch (error) {
      throw new NotFoundException(error);
    }
  };
  delteteposst = async (id: number): Promise<any> => {
    try {
      const approves = await this.prismaservice.post.delete({
        where: {
          id: id,
          approves: false,
        },
      });
      if (!approves) {
        throw new HttpException(
          { message: `Không Xóa Được ${id} Post này` },
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        return approves;
      }
    } catch (error) {
      throw new NotFoundException(error);
    }
  };
  ViewAllPosst = async (): Promise<any> => {
    try {
      const post = await this.prismaservice.post.findMany({
        where: {
          approves: false,
        },
      });
      if (!post || post.length == 0) {
        throw new HttpException(
          { message: `Không có post nào cần duyệt` },
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        return post;
      }
    } catch (error) {
      throw new NotFoundException(error);
    }
  };
  ViewdetailPosst = async (id: number): Promise<any> => {
    try {
      const post = await this.prismaservice.post.findUnique({
        where: {
          id: id,
          approves: false,
        },
      });
      if (!post || post == null) {
        throw new HttpException(
          { message: `Không có post ${id} nào cần duyệt` },
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        return post;
      }
    } catch (error) {
      throw new NotFoundException(error);
    }
  };
}
