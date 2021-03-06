import request from 'supertest'
import { app } from '../../app'
import { createAuthCookie, composeCreateTicketReq } from '../../test/util'
import { TicketDTO } from '../../dto'
import type { RP, RO } from '../../interface'

describe('GET /', () => {
  it('return list of tickets', async () => {
    const authCookie = createAuthCookie()
    const ticketPayloads: RP.CreateTicketBody[] = [
      {
        title: 'ticket A',
        price: 20,
      },
      {
        title: 'ticket B',
        price: 30,
      },
    ]

    function getTicketBatch() {
      return ticketPayloads.map((payload) => {
        return composeCreateTicketReq(authCookie, payload).expect(200)
      })
    }

    await Promise.all(getTicketBatch())

    const indexRes = await request(app).get('/ticket').expect(200)
    const ticketList = (indexRes.body as RO.List<TicketDTO>).data

    expect(ticketList.length).toEqual(2)
  })
})
