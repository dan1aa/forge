import { Module } from '@nestjs/common';
import { FUNCTION_REPOSITORY } from '../../domain/function.repository.js';
import { MemoryFunctionRepository } from '../../adapters/memory/memory-function.repository.js';
import { FunctionsController } from './functions.controller.js';
import { FunctionsService } from './functions.service.js';

@Module({
  controllers: [FunctionsController],
  providers: [
    FunctionsService,
    { provide: FUNCTION_REPOSITORY, useClass: MemoryFunctionRepository },
  ],
  exports: [FunctionsService],
})
export class FunctionsModule {}
