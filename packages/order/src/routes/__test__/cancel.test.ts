import { OrderStatus } from '@teh-tix/common/constant'

import { stan } from '../../lib/stan'
import {
  createAuthCookie,
  composeCreateOrderReq,
  composeCancelOrderReq,
  createTicket,
  composeGetOrderDetailReq,
} from '../../test/util'
import { TicketWriteAttrs } from '../../models/ticket'
import type { RO, DTO } from '../../interface'

const ticketPayload: TicketWriteAttrs = {
  price: 1,
  title: 'event 1',
}

describe('# PATCH /:orderId/cancel', () => {
  it('fetches order', async () => {
    const authCookie = createAuthCookie()
    const ticket = await createTicket(ticketPayload)

    const createOrderRes = await composeCreateOrderReq(authCookie, {
      ticketId: ticket.id,
    }).expect(200)
    const createdOrder = (createOrderRes.body as RO.Item<DTO.Order>).data

    await composeCancelOrderReq(createdOrder.id, authCookie).expect(200)

    const orderDetailRes = await composeGetOrderDetailReq(
      createdOrder.id,
      authCookie,
    ).expect(200)
    const orderDetail = (orderDetailRes.body as RO.Item<DTO.Order>).data

    expect(orderDetail.status).toEqual(OrderStatus.CANCELLED)
  })

  it('publish event after successfully cancel an ticket order', async () => {
    const authCookie = createAuthCookie()
    const ticket = await createTicket(ticketPayload)

    const createOrderRes = await composeCreateOrderReq(authCookie, {
      ticketId: ticket.id,
    }).expect(200)
    const createdOrder = (createOrderRes.body as RO.Item<DTO.Order>).data
    const pubFnMock = jest.spyOn(stan.getPubs().orderCancelledPub, 'publish')

    await composeCancelOrderReq(createdOrder.id, authCookie).expect(200)
    await composeGetOrderDetailReq(createdOrder.id, authCookie).expect(200)

    expect(pubFnMock).toHaveBeenCalled()
  })
})
