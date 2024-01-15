import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { WebhookModule } from './modules/telegram/webhook.module';
import { PrismaModule } from './modules/prisma/prisma.modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(8000),
        COOKIE: Joi.string().default(''),
        PREFIX: Joi.string().default('api'),
        TELEGRAM_ACCESS_TOKEN: Joi.string(),
        TELEGRAM_SECRET_TOKEN: Joi.string(),
      }),
    }),
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [ConfigService],
})
export class AppModule {}
