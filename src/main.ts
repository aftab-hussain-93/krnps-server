import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.enableVersioning({
    type: VersioningType.URI
  })
  app.enableCors({
    origin: true,
    credentials: true
  });
  app.use(cookieParser());
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.setGlobalPrefix('api')
  
  const config = new DocumentBuilder()
    .setTitle('KRNPS Server API')
    .setDescription('API Docs')
    .build()
  
  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('/', app, document)

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
