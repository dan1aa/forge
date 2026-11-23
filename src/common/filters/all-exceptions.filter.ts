import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { STATUS_CODES } from 'node:http';
import { DomainError } from '../../domain/errors.js';

const DOMAIN_STATUS: Record<string, number> = {
  NOT_FOUND: HttpStatus.NOT_FOUND,
  CONFLICT: HttpStatus.CONFLICT,
  INVALID_CURSOR: HttpStatus.BAD_REQUEST,
};

interface Problem {
  status: number;
  code: string;
  detail: string;
  errors?: string[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly log = new Logger(AllExceptionsFilter.name);

  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.adapterHost;
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    const p = this.toProblem(exception);
    if (p.status >= 500) {
      this.log.error(
        `Unhandled: ${exception instanceof Error ? exception.message : String(exception)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    httpAdapter.setHeader(res, 'Content-Type', 'application/problem+json');
    httpAdapter.reply(
      res,
      {
        type: 'about:blank',
        title: STATUS_CODES[p.status] ?? 'Error',
        status: p.status,
        code: p.code,
        detail: p.detail,
        ...(p.errors && { errors: p.errors }),
        instance: httpAdapter.getRequestUrl(req),
        requestId: req.id,
      },
      p.status,
    );
  }

  private toProblem(e: unknown): Problem {
    if (e instanceof DomainError) {
      return { status: DOMAIN_STATUS[e.code] ?? 500, code: e.code, detail: e.message };
    }
    if (e instanceof HttpException) {
      const status = e.getStatus();
      const body = e.getResponse() as string | { message?: string | string[] };
      const message = typeof body === 'string' ? body : body.message;
      if (Array.isArray(message)) {
        return { status, code: 'VALIDATION_FAILED', detail: 'Request validation failed', errors: message };
      }
      return { status, code: HttpStatus[status] ?? 'HTTP_ERROR', detail: message ?? e.message };
    }
    return { status: 500, code: 'INTERNAL', detail: 'Internal server error' };
  }
}
