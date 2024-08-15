import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminApproveService, AdminService } from './admin.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.Access_Token_Key, // Khóa bí mật để xác thực JWT
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, PrismaService, AdminApproveService],
})
export class AdminModule {}
