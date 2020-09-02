import request from 'supertest'
import { app } from '../../app'
import {
  createAuthCookie,
  generateMongooseId,
  composeCreateTicketReq,
} from '../../test/util'
import { TicketDTO } from '../../dto'

describe('GET /:id', () => {
  it('return 404 it ticket is not found', async () => {
    const id = generateMongooseId()

    await request(app).get(`/ticket/${id}`).expect(404)
  })

  it('return ticket if it found', async () => {
    const authCookie = createAuthCookie()
    const ticket = {
      title: 'Sport event',
      price: 1500,
    }
    const createTicketRes = await composeCreateTicketReq(
      authCookie,
      ticket,
    ).expect(200)
    const createdTicket = createTicketRes.body.data as TicketDTO
    const showTicketRes = await request(app)
      .get(`/ticket/${createdTicket.id}`)
      .expect(200)
    const showedTicket = showTicketRes.body.data as TicketDTO

    expect(showedTicket).toMatchObject(createdTicket)
  })
})
