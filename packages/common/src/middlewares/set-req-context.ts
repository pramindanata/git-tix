import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { JWTPayload } from '../interface';

export const setReqContext = (jwtSecret: string) => (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  req.ctx = {
    authUser: undefined,
  };

  const token = req.session?.token as string | null;

  // Only set user context here.
  // The checking process if the token payload is invalid
  // (empty, expired, wrong schema, or etc) will be done
  //  in `auth` middleware
  if (token) {
    try {
      const tokenPayload = jwt.verify(token, jwtSecret) as JWTPayload;
      req.ctx.authUser = {
        id: tokenPayload.id,
        email: tokenPayload.email,
      };
    } catch (err) {}
  }

  return next();
};
