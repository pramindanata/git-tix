import { Router } from 'express'
import { auth } from '@teh-tix/common/middleware'
import { OrderStatus } from '@teh-tix/common/constant'
import {
  NotFoundError,
  ActionFailType,
  ActionFailError,
} from '@teh-tix/common/exception'
import type { Request, Response } from 'express'

import { stan } from '../lib/stan'
import { Order } from '../models/order'
import { OrderMapper } from '../util'
import type { DTO, RO, RP } from '../interface'

const router = Router()

router.patch(
  '/:orderId/cancel',
  auth(),
  async (
    req: Request<RP.CancelOrderParams>,
    res: Response<RO.Item<DTO.Order>>,
  ) => {
    const { orderId } = req.params
    const user = req.ctx.authUser!
    const order = await Order.findById(orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== user.id) {
      throw new ActionFailError(ActionFailType.FORBIDDEN)
    }

    order.status = OrderStatus.CANCELLED

    await order.save()

    const orderDTO = OrderMapper.toDTO(order)

    await stan.getPubs().orderCancelledPub.publish({
      id: orderDTO.id,
      version: order.version,
      ticket: {
        id: orderDTO.ticket.id,
      },
    })

    return res.json({
      data: OrderMapper.toDTO(order),
    })
  },
)

export { router as cancelOrderRouter }
