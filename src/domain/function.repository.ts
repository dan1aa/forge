import { FunctionEntity, FunctionLimits } from './function.js';

export const FUNCTION_REPOSITORY = Symbol('FUNCTION_REPOSITORY');

export interface NewFunction {
  name: string;
  code: string;
  limits: FunctionLimits;
  ownerClientId: string;
}

export type FunctionPatch = Partial<Pick<FunctionEntity, 'name' | 'code' | 'limits'>>;

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

export interface FunctionRepository {
  create(data: NewFunction): Promise<FunctionEntity>;
  findById(id: string): Promise<FunctionEntity | null>;
  list(opts: { cursor?: string; limit: number }): Promise<Page<FunctionEntity>>;
  update(id: string, patch: FunctionPatch): Promise<FunctionEntity>;
  delete(id: string): Promise<void>;
}
