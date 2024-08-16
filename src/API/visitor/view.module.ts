import { Module } from '@nestjs/common';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ViewController],
  providers: [ViewService, PrismaService],
})
export class ViewModule {}
