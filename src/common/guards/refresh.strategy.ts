import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import jwt = require('jsonwebtoken');
import { SessionService } from 'src/modules/session/session.service';
import { CheckSessionDto } from 'src/modules/session/session.dto';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly sessionService: SessionService) {
    super();
  }

  async validate(req: Request) {
    try {
      let refreshToken: string = req.cookies['refreshToken'];
      if (!refreshToken) {
        refreshToken = (req.headers['refreshToken'] as string) ?? '';
      }

      const decoded = jwt.decode(refreshToken) as CheckSessionDto;
      const { userId, deviceId } = decoded;

      const isValid = await this.sessionService.checkSession({
        userId,
        deviceId,
        refreshToken,
      });

      if (!isValid) {
        throw new UnauthorizedException();
      }

      return userId;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}

export const RefreshGuard = AuthGuard('refresh');
