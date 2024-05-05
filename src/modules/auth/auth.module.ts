import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshStrategy } from 'src/common/guards/refresh.strategy';
import { SessionService } from '../session/session.service';
import { OAuthController } from './oauth.controller';
import { UserService } from '../user/user.service';

@Module({
  controllers: [AuthController, OAuthController],
  providers: [AuthService, PrismaService, RefreshStrategy, SessionService, UserService],
  exports: [AuthService],
})
export class AuthModule {}
