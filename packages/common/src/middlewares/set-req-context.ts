import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { JWTPayload } from '../interface';

export const setReqContext = () => (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  req.ctx = {
    authUser: undefined,
  };

  const token = req.cookies?.token as string | null;

  if (token) {
    try {
      const tokenPayload = jwt.decode(token) as JWTPayload;
      req.ctx.authUser = {
        id: tokenPayload.id,
        email: tokenPayload.email,
      };
    } catch (err) {}
  }

  return next();
};
