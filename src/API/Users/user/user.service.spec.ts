import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../../prisma.service';
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto, UserDto } from './dto/user.dto';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              update: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update user successfully', async () => {
    const iduser = 1;
    const userdata: UserDto = {
      name: 'John Doe',
      phone: '1234567890',
      email: 'john.doe@example.com',
      password: 'password123',
      status: 1,
    };

    const updatedUser = {
      ...userdata,
      id: iduser,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(prismaService.user, 'update').mockResolvedValue(updatedUser);

    const result = await service.update(iduser, userdata);
    expect(result).toEqual(updatedUser);
  });

  it('should throw an error when update fails by name null', async () => {
    const iduser = 1;
    const userdata: UserDto = {
      name: null,
      phone: '1234567890',
      email: 'john.doe@example.com',
      password: 'password123',
      status: null,
    };
    jest.spyOn(prismaService.user, 'update').mockResolvedValue(null);

    await expect(service.update(iduser, userdata)).rejects.toThrow(
      HttpException,
    );
  });

  it('should return user successfully', async () => {
    const iduser = 1;
    const user = {
      id: iduser,
      name: 'John Doe',
      phone: '1234567890',
      email: 'john.doe@example.com',
      password: 'password123',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

    const result = await service.view(iduser);
    expect(result).toEqual(user);
  });

  it('should throw an error when user not found', async () => {
    const iduser = 1;

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

    await expect(service.view(iduser)).rejects.toThrow(HttpException);
  });
  it('should delete user successfully', async () => {
    const iduser = 1;
    const user = {
      id: iduser,
      name: 'John Doe',
      phone: '1234567890',
      email: 'john.doe@example.com',
      password: 'password123',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(prismaService.user, 'delete').mockResolvedValue(user);

    const result = await service.delete(iduser);
    expect(result).toEqual(user);
  });

  it('should throw an error when delete fails', async () => {
    const iduser = 1;

    jest.spyOn(prismaService.user, 'delete').mockResolvedValue(null);

    await expect(service.delete(iduser)).rejects.toThrow(HttpException);
  });
  it('should change password successfully', async () => {
    const iduser = 1;
    const userdata: ChangePasswordDto = {
      passwordCurrent: 'oldpassword',
      newPassword: 'newpassword',
      confirmPassword: 'newpassword',
    };
    const user = {
      id: iduser,
      name: 'John Doe',
      phone: '1234567890',
      email: 'john.doe@example.com',
      password: await bcrypt.hash('oldpassword', 10),
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashednewpassword');
    jest
      .spyOn(prismaService.user, 'update')
      .mockResolvedValue({ ...user, password: 'hashednewpassword' });

    const result = await service.change_password(iduser, userdata);
    expect(result.password).toBe('hashednewpassword');
  });

  it('should throw an error when passwords do not match', async () => {
    const iduser = 1;
    const userdata: ChangePasswordDto = {
      passwordCurrent: 'oldpassword',
      newPassword: 'newpassword',
      confirmPassword: 'differentpassword',
    };

    await expect(service.change_password(iduser, userdata)).rejects.toThrow(
      HttpException,
    );
  });

  it('should throw an error when current password is incorrect', async () => {
    const iduser = 1;
    const userdata: ChangePasswordDto = {
      passwordCurrent: 'wrongpassword',
      newPassword: 'newpassword',
      confirmPassword: 'newpassword',
    };
    const user = {
      id: iduser,
      name: 'John Doe',
      phone: '1234567890',
      email: 'john.doe@example.com',
      password: await bcrypt.hash('oldpassword', 10),
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(service.change_password(iduser, userdata)).rejects.toThrow(
      HttpException,
    );
  });
});
