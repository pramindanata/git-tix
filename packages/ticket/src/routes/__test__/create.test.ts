import { Ticket } from '../../models/ticket'
import { createAuthCookie, composeCreateTicketReq } from '../../test/util'
import { stan } from '../../lib/stan'
import type { RP, RO, DTO } from '../../interface'

describe('# POST /', () => {
  it('it has a POST / route', async () => {
    const res = await composeCreateTicketReq()

    expect(res.status).not.toEqual(404)
  })

  it('return 401  if the user is not signed in', async () => {
    await composeCreateTicketReq().expect(401)
  })

  it('return other than 401 if user is signed in', async () => {
    const authCookie = createAuthCookie()
    const res = await composeCreateTicketReq(authCookie, {})

    expect(res.status).not.toEqual(401)
  })

  it('return error if invalid title given', async () => {
    const authCookie = createAuthCookie()

    await composeCreateTicketReq(authCookie, {
      title: '',
      price: 10,
    }).expect(422)

    await composeCreateTicketReq(authCookie, {
      price: 10,
    }).expect(422)
  })

  it('return error if invalid price given', async () => {
    const authCookie = createAuthCookie()

    await composeCreateTicketReq(authCookie, {
      title: 'Sport event',
      price: -20,
    }).expect(422)

    await composeCreateTicketReq(authCookie, {
      title: 'Sport event',
    }).expect(422)
  })

  it('create a ticket with valid inputs', async () => {
    let tickets = await Ticket.find()
    const newTicketPayload: RP.CreateTicketBody = {
      title: 'Sport event',
      price: 10,
    }
    const authCookie = createAuthCookie()

    expect(tickets.length).toEqual(0)

    await composeCreateTicketReq(authCookie, newTicketPayload).expect(200)

    tickets = await Ticket.find()
    const newTicket = tickets[0]

    expect(tickets.length).toEqual(1)
    expect(newTicket.title).toEqual(newTicketPayload.title)
    expect(newTicket.price).toEqual(newTicketPayload.price)
  })

  it('publish an event after successfully create a ticket', async () => {
    const ticket: RP.CreateTicketBody = {
      title: 'Sport event',
      price: 10,
    }
    const authCookie = createAuthCookie()
    const res = await composeCreateTicketReq(authCookie, ticket).expect(200)
    const pubFnMock = jest.spyOn(stan.getPubs().ticketCreatedPub, 'publish')

    const resBody = res.body as RO.Item<DTO.Ticket>
    const createdTicket = resBody.data
    const mockedTicketArg = pubFnMock.mock.calls[0][0] as DTO.Ticket

    expect(pubFnMock).toHaveBeenCalled()
    expect(mockedTicketArg).toEqual(createdTicket)
  })
})
