import { Router } from 'express'
import { Types } from 'mongoose'
import { body } from 'express-validator'
import { OrderStatus } from '@teh-tix/common/constant'
import { ActionFailError, ActionFailType } from '@teh-tix/common/exception'
import { auth, validateRequestPayload } from '@teh-tix/common/middleware'
import type { Request, Response } from 'express'

import { stan } from '../lib/stan'
import { Order } from '../models/order'
import { Ticket } from '../models/ticket'
import { getOneReservedOrder } from '../service'
import { OrderMapper, generateOrderExpirationDate } from '../util'
import type { DTO, RO, RP } from '../interface'

const router = Router()

router.post(
  '/',
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => Types.ObjectId.isValid(input))
      .withMessage('Ticket ID must be provided'),
  ],
  auth(),
  validateRequestPayload(),
  async (
    req: Request<any, any, RP.CreateOrderBody>,
    res: Response<RO.Item<DTO.Order>>,
  ) => {
    const user = req.ctx.authUser!
    const { ticketId } = req.body
    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
      throw new ActionFailError(ActionFailType.TICKET_NOT_FOUND)
    }

    const reservedOrder = await getOneReservedOrder(ticket)

    if (reservedOrder) {
      throw new ActionFailError(ActionFailType.RESERVED_TICKET)
    }

    const expirationDate = generateOrderExpirationDate()
    const order = Order.build({
      status: OrderStatus.CREATED,
      expiredAt: expirationDate,
      ticket,
      userId: user.id,
    })

    await order.save()

    const orderDTO = OrderMapper.toDTO(order)

    await stan.getPubs().orderCreatedPub.publish({
      id: orderDTO.id,
      status: orderDTO.status,
      expiredAt: orderDTO.expiredAt,
      userId: user.id,
      version: order.version,
      ticket: {
        id: orderDTO.ticket.id,
        price: orderDTO.ticket.price,
      },
    })

    return res.json({
      data: orderDTO,
    })
  },
)

export { router as createOrderRouter }
