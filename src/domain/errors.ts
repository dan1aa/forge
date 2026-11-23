export abstract class DomainError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} '${id}' not found`, 'NOT_FOUND');
  }
}

export class EntityConflictError extends DomainError {
  constructor(message: string) {
    super(message, 'CONFLICT');
  }
}

export class InvalidCursorError extends DomainError {
  constructor() {
    super('Invalid pagination cursor', 'INVALID_CURSOR');
  }
}
