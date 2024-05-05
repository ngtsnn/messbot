import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { VerifyMagicBody } from './auth.dto';
import { Request, Response } from 'express';
import { DeviceInterceptor } from 'src/common/interceptors/device.interceptors';
import { RefreshGuard } from 'src/common/guards/refresh.strategy';
import { TeleOauthBody, TelegramUser } from './oauth.dto';
import { createHash, createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/user.dto';

@Controller('/oauth')
@ApiTags('OAuth')
@UseInterceptors(DeviceInterceptor)
export class OAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post('tele')
  async onTeleOauthCallback(
    @Body() body: TeleOauthBody,
    @Req() req: Request & { deviceId: string },
    @Res() res: Response,
  ) {
    const result = this.authService.verifyTeleOauth(body);

    if (!result) {
      res.status(401).json({ data: 'BadRequest', status: 401 });
      throw new BadRequestException();
    }

    const userDTO: CreateUserDto = {
      id: body.id,
      first_name: body.first_name,
      last_name: body.last_name,
      language_code: 'vi',
    };
    await this.userService.createUser(userDTO);

    const deviceId = req.deviceId;
    const refreshToken = await this.authService.generateRefreshToken(
      body.id,
      deviceId,
    );
    const accessToken = this.authService.generateAccessToken(body.id);

    res.cookie('refreshToken', refreshToken, {
      sameSite: 'none',
      expires: new Date(Date.now() + 120960000), // 2 weeks
      httpOnly: true,
      secure: true,
    });
    res.cookie('accessToken', accessToken, {
      sameSite: 'none',
      expires: new Date(Date.now() + 1800000), // 30 mins
      httpOnly: true,
      secure: true,
    });

    res.status(200).send('ok');

    return true;
  }
}
