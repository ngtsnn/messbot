import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { WebhookModule } from './modules/telegram/webhook.module';
import { PrismaModule } from './modules/prisma/prisma.modules';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategy } from './common/guards/jwt.strategy';
import { BudgetModule } from './modules/budget/budget.module';

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
        TELEGRAM_ACCESS_TOKEN: Joi.string().required(),
        TELEGRAM_SECRET_TOKEN: Joi.string().required(),
        POSTGRES_DB_URL: Joi.string().required(),
        MAGIC_SECRET: Joi.string().required(),
        ACCESS_SECRET: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        API_URL: Joi.string().required(),
        APP_URL: Joi.string().required(),
      }),
    }),
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
    }),
    JwtModule.register({ global: true }),
    WebhookModule,
    AuthModule,
    BudgetModule,
  ],
  controllers: [AppController],
  providers: [ConfigService, JwtStrategy],
})
export class AppModule {}
