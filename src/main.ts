import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cors = require('cors');
import cookieParser = require('cookie-parser');
import { ValidationPipe,  } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pipes
  app.useGlobalPipes(

    new ValidationPipe({
      transform: true,
      skipNullProperties: true,
      whitelist: true,
    }),
  );

  // Middlewares
  app.use(
    helmet(),
    cookieParser(process.env.COOKIE),
    cors({
      credentials: true,
      origin: '*',
    }),
  );

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
