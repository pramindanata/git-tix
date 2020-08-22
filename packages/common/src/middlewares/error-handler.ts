import type { Request, Response, NextFunction } from 'express';
import { BaseError, ActionFailError, ActionFailType } from '../exceptions';

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
    const error = new ActionFailError(ActionFailType.CAST_ERROR);
    const statusCode = error.getStatusCode();
    const errorData = error.serialize();

    return res.status(statusCode).send({
      errorData,
    });
  }

  /* eslint-disable */
  console.error(err);

  return next(err);
};
