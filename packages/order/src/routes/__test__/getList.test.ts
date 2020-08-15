import {
  createAuthCookie,
  composeCreateOrderReq,
  composeGetOrderListReq,
  createTicket,
} from '../../test/util'
import { TicketWriteAttrs } from '../../models/ticket'
import type { RO, DTO } from '../../interface'

const ticketPaylaods: TicketWriteAttrs[] = [
  {
    price: 1,
    title: 'event 1',
  },
  {
    price: 2,
    title: 'event 2',
  },
  {
    price: 3,
    title: 'event 3',
  },
]

describe('# GET /', () => {
  it('fetches orders for particular user', async () => {
    const authCookieA = createAuthCookie('user_a')
    const authCookieB = createAuthCookie('user_b')
    const [ticketA, ticketB, ticketC] = await Promise.all(
      ticketPaylaods.map((ticket) => createTicket(ticket)),
    )

    await composeCreateOrderReq(authCookieA, { ticketId: ticketA.id }).expect(
      200,
    )

    const userBOrderBatch = [ticketB, ticketC].map((ticket) =>
      composeCreateOrderReq(authCookieB, { ticketId: ticket.id }).expect(200),
    )

    const userBCreateOrderResponses = await Promise.all(userBOrderBatch)
    const [createdOrderB, createdOrderC] = userBCreateOrderResponses.map(
      (res) => {
        const body = res.body as RO.Item<DTO.Order>

        return body.data
      },
    )

    const res = await composeGetOrderListReq(authCookieB).expect(200)
    const resBody = res.body as RO.List<DTO.Order>

    expect(resBody.data.length).toEqual(2)
    expect(createdOrderB.id).toEqual(resBody.data[0].id)
    expect(createdOrderC.id).toEqual(resBody.data[1].id)
  })
})
