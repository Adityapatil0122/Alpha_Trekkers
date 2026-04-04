import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  errors?: { field: string; message: string }[];
}

export function errorHandler(err: ApiError, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (statusCode === 500) {
    console.error('Server Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.errors && { errors: err.errors }),
  });
}
