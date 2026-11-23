import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { LoggerModule } from 'nestjs-pino'
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
  controllers: [],
  providers: [],
})
export class AppModule {}
