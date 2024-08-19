import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ViewService } from './view.service';
import {
  IdTypeReaction,
  PostPaginationResType,
  PostSearchType,
  UserPaginationResType,
  UserSearchType,
} from './dto/view.dto';
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
  @Get('user')
  searchUser(@Query() body: UserSearchType): Promise<UserPaginationResType> {
    return this.viewservice.searchUser(body);
  }

  @Get('user-reaction-post/:id')
  async fillterReactedPostsByUser(
    @Query() body: IdTypeReaction,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return this.viewservice.fillterReactedPostsByUser(body, id);
  }

  @Get('all-comment/:id')
  async viewallcomment(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.viewservice.viewallcomment(id);
  }
}
