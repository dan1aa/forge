import { PartialType } from '@nestjs/swagger';
import { CreateFunctionDto } from './create-function.dto.js';

export class UpdateFunctionDto extends PartialType(CreateFunctionDto) {}
