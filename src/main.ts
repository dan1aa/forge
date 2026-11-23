import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { appConfig } from './config/configuration.js';
import { Logger } from 'nestjs-pino';
import { ConfigType } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true, instrument: ObserveInstrument, },);

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI })

  app.useLogger(app.get(Logger))

  app.useGlobalPipes(
     new ValidationPipe({
       whitelist: true,
       forbidNonWhitelisted: true,
       transform: true,
     }),
   );

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY)

  await app.listen(config.port);
}
await bootstrap();
