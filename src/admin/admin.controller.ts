import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminApproveService, AdminService } from './admin.service';
import { StatusDto } from './dto/status.dto';
import { StatusPost } from '@prisma/client';
import { Roles } from '../decorator/role.decorator';
import { Role } from '../middleware/Role.middleware';

@Controller('admin')
@UseGuards(Role)
export class AdminController {
  constructor(
    private adminservice: AdminService,
    private approveService: AdminApproveService,
  ) {}

  @Post('status/add')
  @Roles('ADMIN')
  async addstatus(@Body() body: StatusDto): Promise<StatusPost> {
    return this.adminservice.addStatus(body);
  }

  @Put('status/update/:id')
  @Roles('ADMIN')
  async updateStatus(
    @Body() body: StatusDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StatusPost> {
    return this.adminservice.updateStatus(id, body);
  }

  @Get('status/all')
  @Roles('ADMIN')
  async ViewAllStatus(): Promise<any> {
    return this.adminservice.ViewAllStatus();
  }

  @Get('status/:id')
  @Roles('ADMIN')
  async ViewStatusbyid(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.adminservice.ViewStatusbyid(id);
  }

  @Delete('status/delete/:id')
  @Roles('ADMIN')
  async deleteStatusbyid(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.adminservice.deleteStatusbyid(id);
  }

  @Put('approve/agree')
  @Roles('ADMIN')
  async approve(@Body() body): Promise<any> {
    const { id } = body;
    return this.approveService.ApprovePost(id);
  }

  @Delete('approve/cancel/:id')
  @Roles('ADMIN')
  async cancel(@Body() body): Promise<any> {
    const { id } = body;
    return this.approveService.delteteposst(id);
  }
}
