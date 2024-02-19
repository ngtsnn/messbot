import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshStrategy } from 'src/common/guards/refresh.strategy';
import { SessionService } from '../session/session.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, RefreshStrategy, SessionService],
  exports: [AuthService],
})
export class AuthModule {}
