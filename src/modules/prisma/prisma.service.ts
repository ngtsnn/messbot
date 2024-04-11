import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  retry = 5000;

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (e) {
      Logger.error('Error to connect db: ', e.message);
      this.retry *= 1.5;
      setTimeout(() => {
        Logger.debug('Retry to connect db');
        this.onModuleInit();
      }, this.retry);
    }
  }
}
