import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cors = require('cors');
import cookieParser = require('cookie-parser');
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      skipNullProperties: true,
      whitelist: true,
    }),
  );

  // interceptors
  app.useGlobalInterceptors(new LoggingInterceptor())

  // Middlewares
  app.use(
    helmet(),
    cookieParser(process.env.COOKIE),
  );

  app.enableCors({
    credentials: true,
    origin: true,
  });

  app.setGlobalPrefix(process.env.PREFIX);

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Money manager Messenger bot')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${process.env.PREFIX}/docs`, app, document);

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
