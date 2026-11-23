import { Inject, Injectable } from "@nestjs/common";
import { FUNCTION_REPOSITORY, Page } from "../../domain/function.repository.js";
import type { FunctionRepository } from "../../domain/function.repository.js";
import { CreateFunctionDto } from "./dto/create-function.dto.js";
import { FunctionEntity } from "../../domain/function.js";
import { UpdateFunctionDto } from "./dto/update-function.dto.js";
import { ListFunctionsQuery } from "./dto/list-functions.query.js";

const DEFAULT_LIMITS = { timeoutMs: 5000, memoryMb: 64 };

@Injectable()
export class FunctionsService {


  constructor(@Inject(FUNCTION_REPOSITORY) private readonly repo: FunctionRepository) { }

  create(dto: CreateFunctionDto, ownerClientId: string): Promise<FunctionEntity> {
    return this.repo.create({
      name: dto.name,
      code: dto.code,
      limits: {
        ...DEFAULT_LIMITS, ...dto?.limits
      },
      ownerClientId
    })
  }

  async get(id: string): Promise<FunctionEntity | null> {
    return await this.repo.findById(id)
  }

  list(q: ListFunctionsQuery): Promise<Page<FunctionEntity>> {
    return this.repo.list({ cursor: q.cursor, limit: q.limit })
  }

  update(id: string, dto: UpdateFunctionDto): Promise<FunctionEntity | null> {
    return this.repo.update(id, dto)
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id)
  }
}
