import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { appConfig } from './config/configuration.js';
import { Logger } from 'nestjs-pino';
import { ConfigType } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true, instrument: ObserveInstrument, });
  app.useLogger(app.get(Logger))

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY)

  await app.listen(config.port);
}
await bootstrap();
