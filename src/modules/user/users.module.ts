import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.modules';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserService, UserService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
