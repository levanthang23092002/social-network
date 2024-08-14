import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import { Post as posts } from '@prisma/client';
import { multerConfig } from './multer.config';
import { FileInterceptor } from '@nestjs/platform-express';

interface AuthenticatedRequest extends Request {
  user?: any;
}

@Controller('post')
export class PostController {
  constructor(private postservice: PostService) {}

  @Post('add')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async addPost(
    @Req() req: AuthenticatedRequest,
    @Body() body: PostDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<posts> {
    const id = req.user?.id;
    let imges;
    if (!file) {
      imges = { nameImage: null, pathImage: null };
    } else {
      imges = { nameImage: file.originalname, pathImage: file.path };
    }

    return this.postservice.addPost(id, body, imges);
  }

  @Put('update/:id')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
    @Body() body: PostDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<posts> {
    const iduser = req.user?.id;
    let imges;
    if (!file) {
      imges = { nameImage: null, pathImage: null };
    } else {
      imges = { nameImage: file.originalname, pathImage: file.path };
    }

    return this.postservice.updatePost(iduser, id, body, imges);
  }

  @Delete('delete/:id')
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<posts> {
    const iduser = req.user?.id;
    return this.postservice.deletePost(iduser, id);
  }

  @Get('mypost')
  async viewAllPostbyUser(@Req() req: AuthenticatedRequest): Promise<any> {
    const iduser = req.user?.id;
    return this.postservice.viewAllPostbyUser(iduser);
  }
}
