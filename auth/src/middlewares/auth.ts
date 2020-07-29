import type { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '../exception'

export const auth = (req: Request, res: Response, next: NextFunction): any => {
  if (!req.ctx.authUser) {
    throw new UnauthorizedError()
  }

  return next()
}
