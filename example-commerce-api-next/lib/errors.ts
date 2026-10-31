import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
  static notFound(what: string, id: unknown) {
    return new ApiError(404, 'not_found', `${what} '${id}' was not found`);
  }
  static badRequest(code: string, message: string) {
    return new ApiError(400, code, message);
  }
  static conflict(code: string, message: string) {
    return new ApiError(409, code, message);
  }
}

type Handler<C> = (req: Request, ctx: C) => Promise<unknown>;

/** Wraps a route handler: JSON-serializes the result and renders errors like the Java API does. */
export function handler<C>(fn: Handler<C>, successStatus = 200) {
  return async (req: Request, ctx: C): Promise<Response> => {
    const path = new URL(req.url).pathname;
    try {
      const body = await fn(req, ctx);
      return NextResponse.json(body, { status: successStatus });
    } catch (err) {
      if (err instanceof ApiError) return error(err.status, err.code, err.message, path);
      if (err instanceof ZodError) {
        const msg = err.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ');
        return error(400, 'validation_failed', msg, path);
      }
      if (err instanceof SyntaxError) return error(400, 'bad_request', 'Malformed request', path);
      console.error(`Unhandled error on ${req.method} ${path}`, err);
      return error(500, 'internal_error', 'Something went wrong', path);
    }
  };
}

function error(status: number, code: string, message: string, path: string) {
  return NextResponse.json({ status, code, message, path, timestamp: new Date().toISOString() }, { status });
}
