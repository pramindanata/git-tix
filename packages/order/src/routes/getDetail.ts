import { Router } from 'express'
import { auth } from '@teh-tix/common/middleware'
import {
  NotFoundError,
  ActionFailType,
  ActionFailError,
} from '@teh-tix/common/exception'
import type { Request, Response } from 'express'

import { Order } from '../models/order'
import { OrderDTO } from '../dto'
import type { RO, RP } from '../interface'

const router = Router()

router.get(
  '/:orderId',
  auth(),
  async (
    req: Request<RP.GetOneOrderParams>,
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

    return res.json({
      data: new OrderDTO(order),
    })
  },
)

export { router as getOrderDetailRouter }
