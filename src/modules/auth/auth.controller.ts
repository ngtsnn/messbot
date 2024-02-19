import { BadRequestException, Body, Controller, Get, Post, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { VerifyMagicBody } from './auth.dto';
import { Request, Response } from 'express';
import { DeviceInterceptor } from 'src/common/interceptors/device.interceptors';
import { RefreshGuard } from 'src/common/guards/refresh.strategy';

@Controller('/auth')
@ApiTags('Auth')
@UseInterceptors(DeviceInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('magic')
  async verifyMagicToken(
    @Body() body: VerifyMagicBody,
    @Req() req: Request & { deviceId: string },
    @Res() res: Response,
  ) {
    try {
      const token = body.token;
      const deviceId = req.deviceId;
      const result = await this.authService.verifyMagicToken(token);

      if (!result) {
        throw new BadRequestException('Token Expired');
      }

      const refreshToken = await this.authService.generateRefreshToken(
        result,
        deviceId,
      );

      res.cookie('refreshToken', refreshToken, {
        domain: req.hostname,
        sameSite: 'lax',
        expires: new Date(Date.now() + 120960000), // 2 weeks
        httpOnly: true,
        secure: true,
      });

      res.status(200).send(true);
    } catch (err) {
      console.log('🚀 ~ AuthController ~ err:', err);
      res.status(400).send('Token Expired');
    }
  }

  @UseGuards(RefreshGuard)
  @Get('refresh')
  async refresh(@Req() req: Request & { user: number }, @Res() res: Response) {
    const userId = req.user;

    if (!userId) {
      res.status(401).send(false);
      return false;
    }

    const accessToken = this.authService.generateAccessToken(userId);

    res.cookie('accessToken', accessToken, {
      domain: req.hostname,
      sameSite: 'lax',
      expires: new Date(Date.now() + 1800000), // 30 mins
      httpOnly: true,
      secure: true,
    });

    res.status(200).send(true);

    return true;
  }



}
