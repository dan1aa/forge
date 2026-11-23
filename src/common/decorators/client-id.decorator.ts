import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClientId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => ctx.switchToHttp().getRequest().clientId,
);
