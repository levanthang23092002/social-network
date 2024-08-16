import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { Reactions } from '@prisma/client';
import { ReactionPostDto } from './dto/reaction.dto';

interface AuthenticatedRequest extends Request {
  user?: any;
}

@Controller('reaction')
export class ReactionController {
  constructor(private reactionservice: ReactionService) {}

  @Post('add')
  async addreaction(
    @Req() req: AuthenticatedRequest,
    @Body() body: ReactionPostDto,
  ): Promise<Reactions> {
    const iduser = req.user?.id;
    return await this.reactionservice.addReaction(iduser, body);
  }
  @Put('update')
  async updatereaction(
    @Req() req: AuthenticatedRequest,
    @Body() body: ReactionPostDto,
  ): Promise<Reactions> {
    const iduser = req.user?.id;
    return await this.reactionservice.updateReaction(iduser, body);
  }

  @Delete('detele/:id')
  async detele(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Reactions> {
    const iduser = req.user?.id;
    return await this.reactionservice.deletereaction(iduser, id);
  }

  
}
