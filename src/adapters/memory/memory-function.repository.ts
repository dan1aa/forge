import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FunctionEntity } from '../../domain/function.js';
import { EntityConflictError, EntityNotFoundError, InvalidCursorError } from '../../domain/errors.js';
import { FunctionPatch, FunctionRepository, NewFunction, Page } from '../../domain/function.repository.js';

const encodeCursor = (seq: number) => Buffer.from(String(seq)).toString('base64url');
const decodeCursor = (cursor: string): number => {
  const n = Number(Buffer.from(cursor, 'base64url').toString('utf8'));
  if (!Number.isInteger(n) || n < 0) throw new InvalidCursorError();
  return n;
};

@Injectable()
export class MemoryFunctionRepository implements FunctionRepository {
  private seq = 0;
  private readonly store = new Map<string, { seq: number; entity: FunctionEntity }>();
  private readonly nameIndex = new Map<string, string>();

  async create(data: NewFunction): Promise<FunctionEntity> {
    if (this.nameIndex.has(data.name)) {
      throw new EntityConflictError(`Function '${data.name}' already exists`);
    }
    const now = new Date().toISOString();
    const entity: FunctionEntity = { id: randomUUID(), version: 1, createdAt: now, updatedAt: now, ...data };
    this.store.set(entity.id, { seq: ++this.seq, entity });
    this.nameIndex.set(entity.name, entity.id);
    return structuredClone(entity);
  }

  async findById(id: string): Promise<FunctionEntity | null> {
    const row = this.store.get(id)
    return row ? structuredClone(row.entity) : null
  }

  async list({ cursor, limit }: { cursor?: string; limit: number }): Promise<Page<FunctionEntity>> {
    const after = cursor ? decodeCursor(cursor) : 0;
    const items: FunctionEntity[] = [];
    let lastSeq = 0;
    let hasMore = false;

    for (const { seq, entity } of this.store.values()) {
      if (seq <= after) continue;
      if (items.length === limit) { hasMore = true; break; }
      items.push(structuredClone(entity));
      lastSeq = seq;
    }
    return { items, nextCursor: hasMore ? encodeCursor(lastSeq) : null };
  }

  async update(id: string, patch: FunctionPatch): Promise<FunctionEntity> {
    const row = this.store.get(id);
    if (!row) throw new EntityNotFoundError('Function', id);

    if (patch.name && patch.name !== row.entity.name) {
      if (this.nameIndex.has(patch.name)) {
        throw new EntityConflictError(`Function '${patch.name}' already exists`);
      }
      this.nameIndex.delete(row.entity.name);
      this.nameIndex.set(patch.name, id);
    }
    row.entity = {
      ...row.entity,
      ...patch,
      version: row.entity.version + 1,
      updatedAt: new Date().toISOString(),
    };
    return structuredClone(row.entity);
  }

  async delete(id: string): Promise<void> {
    const row = this.store.get(id);
    if (!row) throw new EntityNotFoundError('Function', id);
    this.nameIndex.delete(row.entity.name);
    this.store.delete(id);
  }
}
