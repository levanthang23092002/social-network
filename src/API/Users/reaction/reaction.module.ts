import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { PrismaService } from 'src/prisma.service';
import { AuthMiddleware } from 'src/middleware/auth.middleware';

@Module({
  controllers: [ReactionController],
  providers: [ReactionService, PrismaService],
})
export class ReactionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ReactionController);
  }
}
