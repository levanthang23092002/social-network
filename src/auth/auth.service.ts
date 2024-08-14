import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/auth.dto';
import { User } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaservice: PrismaService,
    private jwtservice: JwtService,
  ) {}
  register = async (userData: RegisterDto): Promise<User> => {
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
      data: { ...userData, password: hashpassword },
    });
    return res;
  };
  login = async (data: { email: string; password: string }): Promise<any> => {
    const user = await this.prismaservice.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new HttpException(
        { message: 'Account is not exist' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const verify = await compare(data.password, user.password);
    if (!verify) {
      throw new HttpException(
        { message: 'password does not coret' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
    };
    const accesstoken = await this.jwtservice.signAsync(payload, {
      secret: process.env.Access_Token_Key,
      expiresIn: '1h',
    });
    const refeshtoken = await this.jwtservice.signAsync(payload, {
      secret: process.env.Refresh_Token_Key,
      expiresIn: '7d',
    });
    return { accesstoken, refeshtoken };
  };
}
