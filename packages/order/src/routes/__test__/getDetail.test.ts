import {
  createAuthCookie,
  composeCreateOrderReq,
  composeGetOrderDetailReq,
  createTicket,
} from '../../test/util'
import { TicketWriteAttrs } from '../../models/ticket'
import { OrderDTO } from '../../dto'
import type { RO } from '../../interface'

const ticketPayload: TicketWriteAttrs = {
  price: 1,
  title: 'event 1',
}

describe('# GET /:orderId', () => {
  it('fetches order', async () => {
    const authCookie = createAuthCookie()
    const ticket = await createTicket(ticketPayload)

    const createOrderRes = await composeCreateOrderReq(authCookie, {
      ticketId: ticket.id,
    }).expect(200)
    const createdOrder = (createOrderRes.body as RO.Item<OrderDTO>).data

    const orderDetailRes = await composeGetOrderDetailReq(
      createdOrder.id,
      authCookie,
    ).expect(200)
    const orderDetail = (orderDetailRes.body as RO.Item<OrderDTO>).data

    expect(orderDetail.id).toEqual(createdOrder.id)
  })

  it('return an error if other user try to fetch another user order', async () => {
    const authCookieA = createAuthCookie('user_a')
    const authCookieB = createAuthCookie('user_b')
    const ticket = await createTicket(ticketPayload)

    const createOrderRes = await composeCreateOrderReq(authCookieA, {
      ticketId: ticket.id,
    }).expect(200)
    const createdOrder = (createOrderRes.body as RO.Item<OrderDTO>).data

    await composeGetOrderDetailReq(createdOrder.id, authCookieB).expect(403)
  })
})
