import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReactionDto } from './dto/status.dto';
import { ReactionTypes } from '@prisma/client';

@Injectable()
export class ReactionService {
  constructor(private prismaservice: PrismaService) {}

  addReaction = async (data: ReactionDto): Promise<ReactionTypes> => {
    const addstatus = await this.prismaservice.reactionTypes.create({
      data: { ...data },
    });
    if (!addstatus) {
      throw new HttpException(
        { message: 'Không thêm Status của bài post được' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return addstatus;
  };
  updateReaction = async (
    id: number,
    data: ReactionDto,
  ): Promise<ReactionTypes> => {
    const status = await this.prismaservice.reactionTypes.update({
      where: {
        id: id,
      },
      data: { ...data },
    });
    if (!status) {
      throw new HttpException(
        { message: 'cập nhật bại post Không Thành Công' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return status;
  };
  ViewAllReaction = async (): Promise<any> => {
    const status = await this.prismaservice.reactionTypes.findMany({});
    if (!status) {
      throw new HttpException({ message: 'Lỗi' }, HttpStatus.UNAUTHORIZED);
    }
    if (status.length == 0) {
      throw new HttpException(
        { message: 'Không Tìm Thấy Status Nào!' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return status;
  };
  ViewReactionbyid = async (id: number): Promise<ReactionDto> => {
    const status = await this.prismaservice.reactionTypes.findUnique({
      where: {
        id: id,
      },
    });
    if (!status) {
      throw new HttpException(
        { message: `Không Tìm Thấy ${id} Status này` },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return status;
  };
  deleteReactionbyid = async (id: number): Promise<ReactionDto> => {
    const status = await this.prismaservice.reactionTypes.delete({
      where: {
        id: id,
      },
    });
    if (!status) {
      throw new HttpException(
        { message: `Không Xóa Được ${id} Status này` },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return status;
  };
}
