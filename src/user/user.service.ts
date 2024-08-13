import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ChangePasswordDto, UserDto } from './dto/user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaservice: PrismaService) {}

  update = async (iduser: number, userdata: UserDto): Promise<User> => {
    const user = await this.prismaservice.user.update({
      where: {
        id: iduser,
      },
      data: {
        name: userdata.name,
        phone: userdata.phone,
        email: userdata.email,
        password: userdata.password,
        status: userdata.status,
      },
    });
    if (!user) {
      throw new HttpException(
        { message: 'Upate không thành công' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  };
  view = async (iduser: number): Promise<User> => {
    const user = await this.prismaservice.user.findUnique({
      where: {
        id: iduser,
      },
    });
    if (!user) {
      throw new HttpException(
        { message: 'Không Tìm thấy Thông tin' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  };

  delete = async (iduser: number): Promise<User> => {
    const user = await this.prismaservice.user.delete({
      where: {
        id: iduser,
      },
    });
    if (!user) {
      throw new HttpException(
        { message: 'Xóa Account không thanh công' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  };
  change_password = async (
    iduser: number,
    userdata: ChangePasswordDto,
  ): Promise<User> => {
    // Kiểm tra xác nhận mật khẩu
    if (userdata.newPassword !== userdata.confirmPassword) {
      throw new HttpException(
        { message: 'Xác nhận mật khẩu và mật khẩu mới cần trùng nhau' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Tìm người dùng theo iduser
    const user = await this.prismaservice.user.findUnique({
      where: { id: iduser },
    });

    if (!user) {
      throw new HttpException(
        { message: 'Không tìm thấy người dùng' },
        HttpStatus.NOT_FOUND,
      );
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordMatching = await bcrypt.compare(
      userdata.passwordCurrent,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        { message: 'Mật khẩu hiện tại nhập sai' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Cập nhật mật khẩu mới (sau khi đã mã hóa)
    const hashedNewPassword = await bcrypt.hash(userdata.newPassword, 10);
    const updatedUser = await this.prismaservice.user.update({
      where: { id: iduser },
      data: { password: hashedNewPassword },
    });

    return updatedUser;
  };
}
