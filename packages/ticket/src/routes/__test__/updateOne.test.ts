import { TicketUpdatedEventData } from '@teh-tix/common'
import { stan } from '../../lib/stan'
import {
  generateMongooseId,
  createAuthCookie,
  composeCreateTicketReq,
  composeUpdateTicketReq,
  fetchCreateTicketResult,
  fetchUpdateTicketResult,
  fetchGetTicketDetailResult,
} from '../../test/util'
import { TicketDTO } from '../../dto'
import type { RP, RO } from '../../interface'

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
    const createdTicket = await fetchCreateTicketResult(
      firstAuthCookie,
      ticketPayload,
    )

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
    const createdTicketResBody = res.body as RO.Item<TicketDTO>
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

    const createdTicket = await fetchCreateTicketResult(
      authCookie,
      ticketPayload,
    )

    await composeUpdateTicketReq(
      createdTicket.id,
      authCookie,
      updatedTicketPayload,
    ).expect(200)

    const showedTicket = await fetchGetTicketDetailResult(createdTicket.id)

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
    const createdTicket = await fetchCreateTicketResult(
      authCookie,
      ticketPayload,
    )
    const updatedTicket = await fetchUpdateTicketResult(
      createdTicket.id,
      authCookie,
      updatedTicketPayload,
    )

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
    const createdTicket = await fetchCreateTicketResult(
      authCookie,
      ticketPayload,
    )
    const updatedTicket = await fetchUpdateTicketResult(
      createdTicket.id,
      authCookie,
      updatedTicketPayload,
    )

    const pubFnMock = jest.spyOn(stan.getPubs().ticketUpdatedPub, 'publish')
    const mockedTicketArg = pubFnMock.mock.calls[0][0] as TicketUpdatedEventData

    expect(pubFnMock).toHaveBeenCalledTimes(1)
    expect({
      ...mockedTicketArg,
      version: undefined,
      orderId: undefined,
    }).toEqual(updatedTicket)
  })
})
