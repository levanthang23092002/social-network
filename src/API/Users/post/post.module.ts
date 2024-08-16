import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaService } from 'src/prisma.service';
import { AuthMiddleware } from 'src/middleware/auth.middleware';

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService],
})
export class PostModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PostController);
  }
}
