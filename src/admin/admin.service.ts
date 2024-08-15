import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { StatusDto } from './dto/status.dto';
import { Post, StatusPost } from '@prisma/client';
import { promises } from 'dns';

@Injectable()
export class AdminService {
  constructor(private prismaservice: PrismaService) {}

  addStatus = async (data: StatusDto): Promise<StatusPost> => {
    const addstatus = await this.prismaservice.statusPost.create({
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
  updateStatus = async (id: number, data: StatusDto): Promise<StatusPost> => {
    const status = await this.prismaservice.statusPost.update({
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
  ViewAllStatus = async (): Promise<any> => {
    const status = await this.prismaservice.statusPost.findMany({});
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
  ViewStatusbyid = async (id: number): Promise<StatusDto> => {
    const status = await this.prismaservice.statusPost.findUnique({
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
  deleteStatusbyid = async (id: number): Promise<StatusDto> => {
    const status = await this.prismaservice.statusPost.delete({
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

export class AdminApproveService {
  constructor(private prismaservice: PrismaService) {}
  ApprovePost = async (id: number): Promise<Post> => {
    const approves = await this.prismaservice.post.update({
      where: {
        id: id,
      },
      data: {
        approves: true,
      },
    });

    if (!approves) {
      throw new HttpException(
        { message: `Không duyệt Được ${id} Status này` },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return approves;
  };
  delteteposst = async (id: number): Promise<Post> => {
    const approves = await this.prismaservice.post.delete({
      where: {
        id: id,
        approves: false,
      },
    });
    if (!approves) {
      throw new HttpException(
        { message: `Không Xóa Được ${id} Status này` },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return approves;
  };
}
