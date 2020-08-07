import request from 'supertest'
import jwt from 'jsonwebtoken'
import { app } from '../app'
import { config } from '../config'
import type { JWTPayload, SessionPayload } from '../interface'

export function composeCreateTicketReq(
  authCookie?: string,
  body?: unknown,
): request.Test {
  const req = request(app).post('/')

  if (authCookie) {
    req.set('Cookie', [authCookie])
  }

  return req.send((body as any) || {})
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
