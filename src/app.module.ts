import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { LoggerModule } from 'nestjs-pino'
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { appConfig, artifactsConfig, httpConfig, jobConfig, labConfig, workerConfig } from './config/configuration.js';
import { validateEnv } from './config/env.schema.js';
import { ConfigModule } from '@nestjs/config';
import { FunctionsModule } from './modules/functions/functions.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    FunctionsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => validateEnv(config),
      load: [appConfig, httpConfig, jobConfig, workerConfig, labConfig, artifactsConfig]
    }),
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? '',
      appSecret: process.env.OBSERVE_APP_SECRET ?? '',
      serviceId: 'forge',
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                },
              }
            : undefined,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
