import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ViewService } from './view.service';
import { PostPaginationResType, PostSearchType } from './dto/view.dto';
import { Post } from '@prisma/client';

@Controller('view')
export class ViewController {
  constructor(private viewservice: ViewService) {}

  @Get('all')
  viewall(@Query() body: PostSearchType): Promise<PostPaginationResType> {
    return this.viewservice.search(body);
  }
  @Get('detail/:id')
  viewdetail(@Param('id', ParseIntPipe) id: number): Promise<Post> {
    return this.viewservice.getdetai(id);
  }
}