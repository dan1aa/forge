import { Body, Controller, Delete, Get, Headers, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FunctionsService } from "./functions.service.js";
import { CreateFunctionDto } from "./dto/create-function.dto.js";
import { UpdateFunctionDto } from "./dto/update-function.dto.js";
import { ListFunctionsQuery } from "./dto/list-functions.query.js";
import { FunctionEntity } from "../../domain/function.js";

@ApiTags('functions')
@Controller({ path: 'functions', version: '1' })
export class FunctionsController {
  constructor(private readonly functions: FunctionsService) { }

  @Post()
  create(@Body() dto: CreateFunctionDto, @Headers('x-client-id') ownerClientId = 'anonymous'): Promise<FunctionEntity> {
    return this.functions.create(dto, ownerClientId)
  }

  @Get(":id")
  findById(@Param('id', ParseUUIDPipe) id: string): Promise<FunctionEntity | null> {
    return this.functions.get(id)
  }

  @Get()
  list(@Query() q: ListFunctionsQuery) {
    return this.functions.list(q)
  }

  @Patch(":id")
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFunctionDto): Promise<FunctionEntity | null> {
    return this.functions.update(id, dto)
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.functions.remove(id)
  }
}
