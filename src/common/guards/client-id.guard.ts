import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

const CLIENT_ID_RE = /^[A-Za-z0-9_-]{3,64}$/;

@Injectable()
export class ClientIdGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest<Request & { clientId?: string }>();
    const id = req.header('x-client-id');
    if (!id || !CLIENT_ID_RE.test(id)) {
      throw new UnauthorizedException('Missing or invalid x-client-id header');
    }
    req.clientId = id;
    return true;
  }
}
