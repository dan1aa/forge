export interface FunctionLimits {
  timeoutMs: number;
  memoryMb: number;
}

export interface FunctionEntity {
  id: string;
  name: string;
  version: number;
  code: string;
  limits: FunctionLimits;
  ownerClientId: string;
  createdAt: string;   // ISO
  updatedAt: string;
}
