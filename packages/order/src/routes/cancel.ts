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
import { OrderDTO, OrderCancelledEventDTO } from '../dto'
import type { RO, RP } from '../interface'

const router = Router()

router.patch(
  '/order/:orderId/cancel',
  auth(),
  async (
    req: Request<RP.CancelOrderParams>,
    res: Response<RO.Item<OrderDTO>>,
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

    const orderDTO = new OrderDTO(order)
    const orderCancelledEventDTO = new OrderCancelledEventDTO(order)

    await stan.getPubs().orderCancelledPub.publish(orderCancelledEventDTO)

    return res.json({
      data: orderDTO,
    })
  },
)

export { router as cancelOrderRouter }
