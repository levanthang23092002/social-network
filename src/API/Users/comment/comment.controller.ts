import {
  Controller,
  Param,
  Post,
  ParseIntPipe,
  Req,
  Put,
  Delete,
  Body,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from '@prisma/client';
import { CommentDto } from './dto/comment.dto';

interface AuthenticatedRequest extends Request {
  user?: any;
}
@Controller('comment')
export class CommentController {
  constructor(private commentservice: CommentService) {}

  @Post('add/:id')
  async addcomment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CommentDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Comment> {
    const iduser = req.user?.id;
    return this.commentservice.addcomment(iduser, id, body);
  }
  @Put('update/:id')
  async updatecomment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CommentDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Comment> {
    const iduser = req.user?.id;
    return this.commentservice.updatecomment(iduser, id, body);
  }
  @Delete('delete/:id')
  async deletecomment(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Comment> {
    const iduser = req.user?.id;
    return this.commentservice.deletecomment(iduser, id);
  }
}
