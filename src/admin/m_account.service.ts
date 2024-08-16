import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { RegisterAdminDto } from './dto/status.dto';
import { hash } from 'bcrypt';

@Injectable()
export class AccountService {
  constructor(private prismaservice: PrismaService) {}

  lockaccount = async (id: number): Promise<User> => {
    try {
      const lock = await this.prismaservice.user.update({
        where: {
          id: id,
          type: 'User',
        },
        data: {
          status: false,
        },
      });
      if (!lock) {
        throw new HttpException(
          { message: 'Khóa Tài khoản Không Thành công' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      return lock;
    } catch (error) {
      throw new NotFoundException(error);
    }
  };
  unlockaccount = async (id: number): Promise<User> => {
    try {
      const unlock = await this.prismaservice.user.update({
        where: {
          id: id,
          type: 'User',
        },
        data: {
          status: true,
        },
      });
      if (!unlock) {
        throw new HttpException(
          { message: 'Mở khóa Tài khoản Không Thành công' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      return unlock;
    } catch (error) {
      throw new NotFoundException(error);
    }
  };

  viewAllAccountLock = async (): Promise<any> => {
    try {
      const allAccountlock = await this.prismaservice.user.findMany({
        where: {
          status: false,
          type: 'User',
        },
      });
      if (!allAccountlock) {
        throw new HttpException(
          { message: 'Không có user nào bi khóa' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      return allAccountlock;
    } catch (error) {
      throw new NotFoundException(error);
    }
  };
  viewdetailAccountLock = async (id: number): Promise<any> => {
    try {
      const Accountlock = await this.prismaservice.user.findUnique({
        where: {
          status: false,
          id: id,
          type: 'User',
        },
      });
      if (!Accountlock) {
        throw new HttpException(
          { message: `Không có tài khoản có id ${id} bi khóa` },
          HttpStatus.UNAUTHORIZED,
        );
      }
      return Accountlock;
    } catch (error) {
      throw new NotFoundException(error);
    }
  };
  register = async (userData: RegisterAdminDto): Promise<User> => {
    const user = await this.prismaservice.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    if (user) {
      throw new HttpException(
        { message: 'this email has been used' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashpassword = await hash(userData.password, 10);
    const res = this.prismaservice.user.create({
      data: { ...userData, password: hashpassword, type: 'ADMIN' },
    });
    return res;
  };

  updateUsertoAdmin = async (id: number): Promise<User> => {
    const update = await this.prismaservice.user.update({
      where: {
        id: id,
      },
      data: {
        type: 'ADMIN',
      },
    });
    if (!update) {
      throw new HttpException(
        { message: ` update user id ${id} thành Admin thất bại` },
        HttpStatus.BAD_REQUEST,
      );
    }
    return update;
  };

  updateAdmintoUser = async (id: number): Promise<User> => {
    const update = await this.prismaservice.user.update({
      where: {
        id: id,
      },
      data: {
        type: 'USER',
      },
    });
    if (!update) {
      throw new HttpException(
        { message: ` update user id ${id} thành USER thất bại` },
        HttpStatus.BAD_REQUEST,
      );
    }
    return update;
  };
}
