import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../exceptions';

export const validateRequestPayload = (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    throw new RequestValidationError(validationErrors.array());
  }

  next();
};
