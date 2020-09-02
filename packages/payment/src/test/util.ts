import request from 'supertest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { app } from '../app'
import { config } from '../config'
import type { JWTPayload } from '../interface'

interface CustomResponse<Body> extends request.Response {
  body: Body
}

export function generateMongooseId(): string {
  return mongoose.Types.ObjectId().toHexString()
}

export function createAuthCookie(userId = 'random_id'): string {
  const jwtPayload: JWTPayload = {
    id: userId,
    email: 'user@test.com',
    iat: new Date().getTime(),
  }
  const token = jwt.sign(jwtPayload, config.jwt.secret)
  const cookie = `token=${token}`

  return cookie
}

export const doCreatePaymentReq = async <Body>(
  authCookie?: string,
  body?: unknown,
): Promise<CustomResponse<Body>> => {
  const response = await request(app)
    .post('/payment')
    .set('Cookie', [authCookie ?? ''])
    .send((body as any) || {})

  return response
}
