import { OrderStatus } from '@teh-tix/common/constant'
import { ActionFailType } from '@teh-tix/common/exception'
import type { ActionFailBody } from '@teh-tix/common/exception'

import { stan } from '../../lib/stan'
import {
  createAuthCookie,
  composeCreateOrderReq,
  generateMongooseId,
  createTicket,
  createOrder,
} from '../../test/util'
import { OrderDTO } from '../../dto'
import type { RO } from '../../interface'

describe('# POST /', () => {
  it('returns error if ticket does not exist', async () => {
    const ticketId = generateMongooseId()
    const authCookie = createAuthCookie()

    const res = await composeCreateOrderReq(authCookie, {
      ticketId,
    }).expect(403)
    const resBody = res.body as ActionFailBody

    expect(resBody.type).toEqual(ActionFailType.TICKET_NOT_FOUND)
  })

  it('returns error if ticket is already reserved', async () => {
    const authCookie = createAuthCookie()
    const ticket = await createTicket({
      price: 10,
      title: 'ticket',
    })

    await createOrder({
      ticket,
      userId: 'user',
      status: OrderStatus.CREATED,
      expiredAt: new Date(),
    })

    const res = await composeCreateOrderReq(authCookie, {
      ticketId: ticket.id,
    }).expect(403)
    const resBody = res.body as ActionFailBody

    expect(resBody.type).toEqual(ActionFailType.RESERVED_TICKET)
  })

  it('successfully create an ticket order', async () => {
    const authCookie = createAuthCookie()
    const ticket = await createTicket({
      price: 10,
      title: 'ticket',
    })

    const res = await composeCreateOrderReq(authCookie, {
      ticketId: ticket.id,
    }).expect(200)
    const resBody = res.body as RO.Item<OrderDTO>
    const createdOrder = resBody.data

    expect(createdOrder.ticket.id).toEqual(ticket.id)
    expect(createdOrder.status).toEqual(OrderStatus.CREATED)
  })

  it('publish event after successfully create an ticket order', async () => {
    const authCookie = createAuthCookie()
    const ticket = await createTicket({
      price: 10,
      title: 'ticket',
    })
    const pubFnMock = jest.spyOn(stan.getPubs().orderCreatedPub, 'publish')

    await composeCreateOrderReq(authCookie, {
      ticketId: ticket.id,
    }).expect(200)

    expect(pubFnMock).toHaveBeenCalled()
  })
})
