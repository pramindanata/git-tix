import request from 'supertest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { app } from '../app'
import { Ticket, TicketWriteAttrs, TicketDocument } from '../models/ticket'
import { Order, OrderWriteAttrs, OrderDocument } from '../models/order'
import { config } from '../config'
import type { JWTPayload, SessionPayload } from '../interface'

export function generateMongooseId(): string {
  return mongoose.Types.ObjectId().toHexString()
}

export async function createTicket(
  ticket: TicketWriteAttrs,
): Promise<TicketDocument> {
  const createdTicket = Ticket.build(ticket)

  await createdTicket.save()

  return createdTicket
}

export async function createOrder(
  order: OrderWriteAttrs,
): Promise<OrderDocument> {
  const createdOrder = Order.build(order)

  await createdOrder.save()

  return createdOrder
}

export function composeCreateOrderReq(
  authCookie?: string,
  body?: unknown,
): request.Test {
  const req = request(app).post('/')

  if (authCookie) {
    req.set('Cookie', [authCookie])
  }

  return req.send((body as any) || {})
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
