import type { Request, Response, NextFunction } from 'express'
import { CustomError } from '../lib/custom-error'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  if (err instanceof CustomError) {
    const statusCode = err.getStatusCode()
    const errorData = err.serialize()

    return res.status(statusCode).json(errorData)
  }

  return next(err)
}
