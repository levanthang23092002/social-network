import { Body, Controller, Delete, Get, Patch, Put, Req } from '@nestjs/common';
import { ChangePasswordDto, UserDto } from './dto/user.dto';
import { User } from '@prisma/client';
import { UserService } from './user.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface AuthenticatedRequest extends Request {
  user?: any;
}
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Put()
  update(
    @Body() body: UserDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<User> {
    const id = req.user?.id;
    return this.userService.update(id, body);
  }

  @Get()
  view(@Req() req: AuthenticatedRequest): Promise<User> {
    const id = req.user?.id;
    return this.userService.view(id);
  }

  @Delete()
  delete(@Req() req: AuthenticatedRequest): Promise<User> {
    const id = req.user?.id;
    return this.userService.delete(id);
  }
  @Patch()
  changePassword(
    @Body() body: ChangePasswordDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<User> {
    const id = req.user?.id;
    return this.userService.change_password(id, body);
  }
}
