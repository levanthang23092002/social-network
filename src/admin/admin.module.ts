import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { StatusService } from './status.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ApproveService } from './appoves.service';
import { ReactionService } from './Reaction.service';
import { AccountService } from './m_account.service';
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.Access_Token_Key, // Khóa bí mật để xác thực JWT
    }),
  ],
  controllers: [AdminController],
  providers: [
    StatusService,
    PrismaService,
    ApproveService,
    ReactionService,
    AccountService,
  ],
})
export class AdminModule {}
