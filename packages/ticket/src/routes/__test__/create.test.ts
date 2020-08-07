import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { createAuthCookie } from '../../test/util'
import type { CreateTicketReqDTO } from '../../interface'

describe('# POST /', () => {
  it('it has a POST / route', async () => {
    const res = await request(app).post('/').send({})

    expect(res.status).not.toEqual(404)
  })

  it('return 401  if the user is not signed in', async () => {
    await request(app).post('/').send({}).expect(401)
  })

  it('return other than 401 if user is signed in', async () => {
    const authCookie = createAuthCookie()
    const res = await request(app)
      .post('/')
      .set('Cookie', [authCookie])
      .send({})

    expect(res.status).not.toEqual(401)
  })

  it('return error if invalid title given', async () => {
    const authCookie = createAuthCookie()

    await request(app)
      .post('/')
      .set('Cookie', [authCookie])
      .send({
        title: '',
        price: 10,
      })
      .expect(422)

    await request(app)
      .post('/')
      .set('Cookie', [authCookie])
      .send({
        price: 10,
      })
      .expect(422)
  })

  it('return error if invalid price given', async () => {
    const authCookie = createAuthCookie()

    await request(app)
      .post('/')
      .set('Cookie', [authCookie])
      .send({
        title: 'Sport event',
        price: -20,
      })
      .expect(422)

    await request(app)
      .post('/')
      .set('Cookie', [authCookie])
      .send({
        title: 'Sport event',
      })
      .expect(422)
  })

  it('create a ticket with valid inputs', async () => {
    let tickets = await Ticket.find()
    const newTicketPayload: CreateTicketReqDTO = {
      title: 'Sport event',
      price: 10,
    }
    const authCookie = createAuthCookie()

    expect(tickets.length).toEqual(0)

    await request(app)
      .post('/')
      .set('Cookie', [authCookie])
      .send(newTicketPayload)
      .expect(200)

    tickets = await Ticket.find()
    const newTicket = tickets[0]

    expect(tickets.length).toEqual(1)
    expect(newTicket.title).toEqual(newTicketPayload.title)
    expect(newTicket.price).toEqual(newTicketPayload.price)
  })
})
