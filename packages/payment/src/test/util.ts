import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { config } from '../config'
import type { JWTPayload, SessionPayload } from '../interface'

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
