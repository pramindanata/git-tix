import type { Request, Response, NextFunction } from 'express';
import { BaseError, NotFoundError } from '../exceptions';

export const errorHandler = () => (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  if (err instanceof BaseError) {
    const statusCode = err.getStatusCode();
    const errorData = err.serialize();

    return res.status(statusCode).send(errorData);
  }

  if (err.constructor.name === 'CastError') {
    const notFoundError = new NotFoundError();
    const statusCode = notFoundError.getStatusCode();
    const errorData = notFoundError.serialize();

    return res.status(statusCode).send(errorData);
  }

  return next(err);
};
