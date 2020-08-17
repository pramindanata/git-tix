export interface JWTPayload {
  id: string;
  email: string;
  iat: number;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface RequestContext {
  authUser?: AuthUser;
}

export interface Constructor<T = any> {
  new (...args: any[]): T;
}
