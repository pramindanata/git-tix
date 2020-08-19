import request from 'supertest'
import { app } from '../../app'
import { stan } from '../../lib/stan'
import {
  generateMongooseId,
  createAuthCookie,
  composeCreateTicketReq,
  composeUpdateTicketReq,
} from '../../test/util'
import type { RP, RO, DTO } from '../../interface'
import { TicketUpdatedEventData } from '@teh-tix/common'

describe('PUT /:id', () => {
  it('return 404 if ticket does not exist', async () => {
    const mongooseId = generateMongooseId()
    const authCookie = createAuthCookie()

    await composeUpdateTicketReq(mongooseId, authCookie, {
      title: 'title',
      price: 1,
    }).expect(404)
  })

  it('return 401 if user is not signed in', async () => {
    const mongooseId = generateMongooseId()

    await composeUpdateTicketReq(mongooseId).expect(401)
  })

  it('return 403 if user does not own the ticket', async () => {
    const firstAuthCookie = createAuthCookie()
    const secondAuthCookie = createAuthCookie('second_user_id')
    const ticketPayload: RP.CreateTicketBody = {
      title: 'test ticket',
      price: 20,
    }

    const res = await composeCreateTicketReq(
      firstAuthCookie,
      ticketPayload,
    ).expect(200)
    const createdTicketResBody = res.body as RO.Item<DTO.Ticket>
    const createdTicket = createdTicketResBody.data

    await composeUpdateTicketReq(
      createdTicket.id,
      secondAuthCookie,
      ticketPayload,
    ).expect(403)
  })

  it('return 422 if invalid title or price given ', async () => {
    const authCookie = createAuthCookie()
    const ticketPayload: RP.CreateTicketBody = {
      title: 'test ticket',
      price: 20,
    }
    const res = await composeCreateTicketReq(authCookie, ticketPayload).expect(
      200,
    )
    const createdTicketResBody = res.body as RO.Item<DTO.Ticket>
    const createdTicket = createdTicketResBody.data

    await composeUpdateTicketReq(createdTicket.id, authCookie, {
      title: '',
      price: 20,
    }).expect(422)
    await composeUpdateTicketReq(createdTicket.id, authCookie, {
      title: 'new title',
      price: -1,
    }).expect(422)
  })

  it('update the ticket if provided with valid title and price', async () => {
    const authCookie = createAuthCookie()
    const ticketPayload: RP.CreateTicketBody = {
      title: 'test ticket',
      price: 20,
    }
    const updatedTicketPayload: RP.UpdateTicketBody = {
      title: 'new ticket',
      price: 50,
    }
    const createdTicketRes = await composeCreateTicketReq(
      authCookie,
      ticketPayload,
    ).expect(200)
    const createdTicketResBody = createdTicketRes.body as RO.Item<DTO.Ticket>
    const createdTicket = createdTicketResBody.data

    await composeUpdateTicketReq(
      createdTicket.id,
      authCookie,
      updatedTicketPayload,
    ).expect(200)

    const showedTicketRes = await request(app)
      .get(`/${createdTicket.id}`)
      .send()
      .expect(200)
    const showedTicketResBody = showedTicketRes.body as RO.Item<DTO.Ticket>
    const showedTicket = showedTicketResBody.data

    expect(showedTicket.title).toEqual(updatedTicketPayload.title)
    expect(showedTicket.price).toEqual(updatedTicketPayload.price)
  })

  it('return updated ticket', async () => {
    const authCookie = createAuthCookie()
    const ticketPayload: RP.CreateTicketBody = {
      title: 'test ticket',
      price: 20,
    }
    const updatedTicketPayload: RP.UpdateTicketBody = {
      title: 'new ticket',
      price: 50,
    }
    const createdTicketRes = await composeCreateTicketReq(
      authCookie,
      ticketPayload,
    ).expect(200)
    const createdTicketResBody = createdTicketRes.body as RO.Item<DTO.Ticket>
    const createdTicket = createdTicketResBody.data

    const updatedTicketRes = await composeUpdateTicketReq(
      createdTicket.id,
      authCookie,
      updatedTicketPayload,
    ).expect(200)
    const updatedTicketResBody = updatedTicketRes.body as RO.Item<DTO.Ticket>
    const updatedTicket = updatedTicketResBody.data

    expect(updatedTicket.title).toEqual(updatedTicketPayload.title)
    expect(updatedTicket.price).toEqual(updatedTicketPayload.price)
  })

  it('publish an event after successfully update a ticket', async () => {
    const authCookie = createAuthCookie()
    const ticketPayload: RP.CreateTicketBody = {
      title: 'test ticket',
      price: 20,
    }
    const updatedTicketPayload: RP.UpdateTicketBody = {
      title: 'new ticket',
      price: 50,
    }
    const createdTicketRes = await composeCreateTicketReq(
      authCookie,
      ticketPayload,
    ).expect(200)
    const createdTicketResBody = createdTicketRes.body as RO.Item<DTO.Ticket>
    const createdTicket = createdTicketResBody.data

    const updatedTicketRes = await composeUpdateTicketReq(
      createdTicket.id,
      authCookie,
      updatedTicketPayload,
    ).expect(200)
    const updatedTicketResBody = updatedTicketRes.body as RO.Item<DTO.Ticket>
    const updatedTicket = updatedTicketResBody.data

    const pubFnMock = jest.spyOn(stan.getPubs().ticketUpdatedPub, 'publish')
    const mockedTicketArg = pubFnMock.mock.calls[0][0] as TicketUpdatedEventData

    expect(pubFnMock).toHaveBeenCalledTimes(1)
    expect({
      ...mockedTicketArg,
      version: undefined,
    }).toEqual(updatedTicket)
  })
})
