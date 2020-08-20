import { Router } from 'express'
import { auth } from '@teh-tix/common/middleware'
import type { Response } from 'express'

import { Order } from '../models/order'
import { OrderDTO } from '../dto'
import type { RO } from '../interface'

const router = Router()

router.get('/', auth(), async (req, res: Response<RO.List<OrderDTO>>) => {
  const user = req.ctx.authUser!

  const orders = await Order.find({
    userId: user.id,
  }).populate('ticket')

  return res.json({
    data: orders.map((ticket) => new OrderDTO(ticket)),
  })
})

export { router as getOrderListRouter }
