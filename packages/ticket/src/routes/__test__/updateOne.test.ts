import request from 'supertest'
import { app } from '../../app'
import {
  generateMongooseId,
  createAuthCookie,
  composeCreateTicketReq,
} from '../../test/util'
import type { RP, RO, DTO } from '../../interface'

describe('PUT /:id', () => {
  it('return 404 if ticket does not exist', async () => {
    const mongooseId = generateMongooseId()
    const authCookie = createAuthCookie()

    await request(app)
      .put(`/${mongooseId}`)
      .set('Cookie', [authCookie])
      .send({})
      .expect(404)
  })

  it('return 401 if user is not signed in', async () => {
    const mongooseId = generateMongooseId()

    await request(app).put(`/${mongooseId}`).send({}).expect(401)
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

    await request(app)
      .put(`/${createdTicket.id}`)
      .set('Cookie', [secondAuthCookie])
      .send(ticketPayload)
      .expect(403)
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

    await request(app)
      .put(`/${createdTicket.id}`)
      .set('Cookie', [authCookie])
      .send({
        title: '',
        price: 20,
      })
      .expect(422)
    await request(app)
      .put(`/${createdTicket.id}`)
      .set('Cookie', [authCookie])
      .send({
        title: 'test',
        price: -1,
      })
      .expect(422)
  })

  it.only('update the ticket if provided with valid title and price', async () => {
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

    await request(app)
      .put(`/${createdTicket.id}`)
      .set('Cookie', [authCookie])
      .send(updatedTicketPayload)
      .expect(200)

    const showedTicketRes = await request(app)
      .get(`/${createdTicket.id}`)
      .send()
      .expect(200)
    const showedTicketResBody = showedTicketRes.body as RO.Item<DTO.Ticket>
    const showedTicket = showedTicketResBody.data

    expect(showedTicket.title).toEqual(updatedTicketPayload.title)
    expect(showedTicket.price).toEqual(updatedTicketPayload.price)
  })
})
