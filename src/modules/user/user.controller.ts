import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guards/jwt.strategy';
import { AuthRequest } from 'src/types';

@ApiTags('Users')
@Controller('/users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  async getMe(@Req() req: AuthRequest) {
    const { user } = req;
    const data = await this.userService.getOne(user);
    return data;
  }
}
