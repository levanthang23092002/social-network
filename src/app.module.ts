import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_PIPE } from '@nestjs/core';
import { PostModule } from './post/post.module';
import { AdminModule } from './admin/admin.module';
import { ViewModule } from './view/view.module';

@Module({
  imports: [AuthModule, UserModule, PostModule, AdminModule, ViewModule],
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
