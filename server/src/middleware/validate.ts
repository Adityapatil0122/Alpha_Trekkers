import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      return next({
        statusCode: 400,
        message: errors[0]?.message ?? 'Validation error',
        isOperational: true,
        errors,
      });
    }
    req[source] = result.data;
    next();
  };
}
