import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  compare: jest.fn(),
}));
describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should throw an error if email is already used', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue({});

      await expect(
        authService.register({
          name: 'lê văn Thắng',
          phone: '0966948914',
          email: 'test@example.com',
          password: 'password123',
          status: 0,
        }),
      ).rejects.toThrow(
        new HttpException(
          { message: 'this email has been used' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should create a new user if email is not used', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
      prismaService.user.create = jest
        .fn()
        .mockResolvedValue({ id: 1, email: 'test@example.com' });

      const result = await authService.register({
        name: 'lê văn Thắng',
        phone: '0966948914',
        email: 'test@example.com',
        password: 'password123',
        status: 0,
      });
      expect(result).toEqual({ id: 1, email: 'test@example.com' });
    });
  });

  describe('login', () => {
    it('should throw an error if email does not exist', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(
        new HttpException(
          { message: 'Account is not exist' },
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should throw an error if password is incorrect', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(
        new HttpException(
          { message: 'password does not coret' },
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should return tokens if email and password are correct', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync = jest.fn().mockResolvedValue('token');

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual({ accesstoken: 'token', refeshtoken: 'token' });
    });
  });
});
