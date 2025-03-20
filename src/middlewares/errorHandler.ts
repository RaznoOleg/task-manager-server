import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/errors/httpError';

export const errorHandler = (
  err: HttpError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({ error: message });

  next();
};
