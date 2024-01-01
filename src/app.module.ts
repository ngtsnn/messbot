import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        COOKIE: Joi.string().default(''),
        PREFIX: Joi.string().default('api'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [ConfigService],
})
export class AppModule {}
