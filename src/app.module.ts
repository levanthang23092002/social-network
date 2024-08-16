import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './API/Users/user/user.module';
import { APP_PIPE } from '@nestjs/core';
import { PostModule } from './API/Users/post/post.module';
import { AdminModule } from './API/admin/admin.module';
import { ViewModule } from './API/visitor/view.module';
import { ReactionModule } from './API/Users/reaction/reaction.module';
import { CommentModule } from './API/Users/comment/comment.module';

@Module({
  imports: [AuthModule, UserModule, PostModule, AdminModule, ViewModule, ReactionModule, CommentModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
