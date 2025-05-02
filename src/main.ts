import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { ExceptionFilter } from './common/exceptions/rpc-exception.filter';
import { AppModule } from './app.module';
import { envs } from './common/envs/envs';

async function bootstrap() {
  const allowedOrigins = envs.CORS_ORIGIN.split(',');
  const logger = new Logger('Main-gateway');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true}),
  );
  app.useGlobalFilters(new ExceptionFilter());
  app.use(cookieParser());

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  const config = new DocumentBuilder()
    .setTitle('TaskMate RESTFul API')
    .setDescription('API para todos los microservicios')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3009);

  logger.log(`Gateway running on port ${envs.PORT}`);
}
bootstrap();
