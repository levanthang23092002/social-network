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
  UseGuards,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { RegisterAdminDto, StatusDto } from './dto/status.dto';
import { StatusPost, User } from '@prisma/client';
import { Roles } from '../../decorator/role.decorator';
import { Role } from '../../middleware/Role.middleware';
import { ApproveService } from './appoves.service';
import { ReactionService } from './Reaction.service';
import { AccountService } from './m_account.service';

interface AuthenticatedRequest extends Request {
  user?: any;
}
@Controller('admin')
@UseGuards(Role)
export class AdminController {
  constructor(
    private statusservice: StatusService,
    private approveService: ApproveService,
    private reactionservice: ReactionService,
    private accountservice: AccountService,
  ) {}

  // funtion for status post

  @Post('status/add')
  @Roles('ADMIN')
  async addstatus(@Body() body: StatusDto): Promise<StatusPost> {
    return this.statusservice.addStatus(body);
  }

  @Put('status/update/:id')
  @Roles('ADMIN')
  async updateStatus(
    @Body() body: StatusDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StatusPost> {
    return this.statusservice.updateStatus(id, body);
  }

  @Get('status/all')
  @Roles('ADMIN')
  async ViewAllStatus(): Promise<any> {
    return this.statusservice.ViewAllStatus();
  }

  @Get('status/:id')
  @Roles('ADMIN')
  async ViewStatusbyid(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.statusservice.ViewStatusbyid(id);
  }

  @Delete('status/delete/:id')
  @Roles('ADMIN')
  async deleteStatusbyid(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.statusservice.deleteStatusbyid(id);
  }

  // funtion for approves post
  @Put('approve/agree')
  @Roles('ADMIN')
  async approve(@Body() body): Promise<any> {
    const { id } = body;
    return this.approveService.ApprovePost(id);
  }

  @Delete('approve/cancel')
  @Roles('ADMIN')
  async cancel(@Body() body): Promise<any> {
    const { id } = body;
    return this.approveService.delteteposst(id);
  }
  @Get('approve/viewall')
  @Roles('ADMIN')
  async viewall(): Promise<any> {
    return this.approveService.ViewAllPosst();
  }

  @Get('approve/detail/:id')
  @Roles('ADMIN')
  async viewdetail(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.approveService.ViewdetailPosst(id);
  }

  // funtion Reaction type for post
  @Post('reaction/add')
  @Roles('ADMIN')
  async addReaction(@Body() body: StatusDto): Promise<StatusPost> {
    return this.reactionservice.addReaction(body);
  }

  @Put('reaction/update/:id')
  @Roles('ADMIN')
  async updateReaction(
    @Body() body: StatusDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StatusPost> {
    return this.reactionservice.updateReaction(id, body);
  }

  @Get('reaction/all')
  @Roles('ADMIN')
  async ViewAllReaction(): Promise<any> {
    return this.reactionservice.ViewAllReaction();
  }

  @Get('reaction/:id')
  @Roles('ADMIN')
  async ViewReactionbyid(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.reactionservice.ViewReactionbyid(id);
  }

  @Delete('reaction/delete/:id')
  @Roles('ADMIN')
  async deleteReactionbyid(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return await this.reactionservice.deleteReactionbyid(id);
  }

  // funtion managerment  Account

  @Put('lock/:id')
  async lockaccount(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.accountservice.lockaccount(id);
  }

  @Put('unlock/:id')
  @Roles('ADMIN')
  async unlockaccount(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.accountservice.unlockaccount(id);
  }
  @Get('viewall/lock')
  @Roles('ADMIN')
  async viewalllockaccount(): Promise<any> {
    return await this.accountservice.viewAllAccountLock();
  }

  @Get('viewall/lock/:id')
  @Roles('ADMIN')
  async viewdetailaccountLock(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return await this.accountservice.viewdetailAccountLock(id);
  }

  @Post('register')
  @Roles('ADMIN')
  async registerAdmin(@Body() body: RegisterAdminDto): Promise<User> {
    return await this.accountservice.register(body);
  }

  @Put('update/user-to-admin/:id')
  @Roles('ADMIN')
  async updateUsertoAdmin(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User> {
    return await this.accountservice.updateUsertoAdmin(id);
  }

  @Put('update/admin-to-user')
  @Roles('ADMIN')
  async updateAdmintoUser(@Req() req: AuthenticatedRequest): Promise<User> {
    const id = req.user.id;
    return await this.accountservice.updateAdmintoUser(id);
  }
}
