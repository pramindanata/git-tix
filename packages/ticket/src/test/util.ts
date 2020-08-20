import request from 'supertest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { app } from '../app'
import { config } from '../config'
import { TicketDTO } from '../dto'
import type { JWTPayload, SessionPayload, RP, RO } from '../interface'

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

export function composeUpdateTicketReq(
  ticketId: string,
  authCookie?: string,
  body?: unknown,
): request.Test {
  const req = request(app).put(`/${ticketId}`)

  if (authCookie) {
    req.set('Cookie', [authCookie])
  }

  return req.send((body as any) || {})
}

export async function fetchGetTicketDetailResult(
  ticketId: string,
): Promise<TicketDTO> {
  const ticketDetailRes = await request(app).get(`/${ticketId}`).send()
  const ticketDetailResBody = ticketDetailRes.body as RO.Item<TicketDTO>
  const ticketDetail = ticketDetailResBody.data

  return ticketDetail
}

export async function fetchCreateTicketResult(
  authCookie: string,
  body: RP.CreateTicketBody,
): Promise<TicketDTO> {
  const createdTicketRes = await composeCreateTicketReq(authCookie, body)
  const createdTicketResBody = createdTicketRes.body as RO.Item<TicketDTO>
  const createdTicket = createdTicketResBody.data

  return createdTicket
}

export async function fetchUpdateTicketResult(
  ticketId: string,
  authCookie: string,
  body: RP.UpdateTicketBody,
): Promise<TicketDTO> {
  const updatedTicketRes = await composeUpdateTicketReq(
    ticketId,
    authCookie,
    body,
  )
  const updatedTicketResBody = updatedTicketRes.body as RO.Item<TicketDTO>
  const updatedTicket = updatedTicketResBody.data

  return updatedTicket
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
