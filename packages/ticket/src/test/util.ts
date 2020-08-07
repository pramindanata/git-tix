import request from 'supertest'
import jwt from 'jsonwebtoken'
import { app } from '../app'
import { config } from '../config'
import type { JWTPayload, SessionPayload } from '../interface'

export function composeSigninReq(body: unknown): request.Test {
  return request(app)
    .post('/signin')
    .send(body as any)
}

export function composeSignupReq(body: unknown): request.Test {
  return request(app)
    .post('/signup')
    .send(body as any)
}

export function composeSignoutReq(): request.Test {
  return request(app).post('/signout')
}

export function composeGetCurUser(): request.Test {
  return request(app).get('/current-user')
}

export function createAuthCookie(): string {
  const jwtPayload: JWTPayload = {
    id: 'random_id',
    email: 'user@test.com',
    iat: new Date().getTime(),
  }
  const token = jwt.sign(jwtPayload, config.jwt.secret)
  const sessionPayload: SessionPayload = {
    token,
  }
  const sessionPayloadJSON = JSON.stringify(sessionPayload)
  const encodedSessionPayload = Buffer.from(sessionPayloadJSON).toString(
    'base64',
  )
  const session = `express:sess=${encodedSessionPayload}`

  return session
}
