import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import jwt = require('jsonwebtoken');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super();
  }

  async validate(req: Request) {
    try {
      let accessToken: string = req.cookies['accessToken'];
      if (!accessToken) {
        accessToken = (req.headers['accessToken'] as string) ?? '';
      }

      const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET) as {
        userId: string;
      };
      const { userId } = decoded;

      if (!userId || Number.isNaN(+userId)) {
        throw new UnauthorizedException();
      }

      return +userId;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}

export const JwtGuard = AuthGuard('jwt');
