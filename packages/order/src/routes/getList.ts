import { Router } from 'express'
import { auth } from '@teh-tix/common/middleware'
import type { Response } from 'express'

import { Order } from '../models/order'
import { OrderMapper } from '../util'
import type { DTO, RO } from '../interface'

const router = Router()

router.get('/', auth(), async (req, res: Response<RO.List<DTO.Order>>) => {
  const user = req.ctx.authUser!

  const orders = await Order.find({
    userId: user.id,
  }).populate('ticket')

  return res.json({
    data: orders.map(OrderMapper.toDTO),
  })
})

export { router as getOrderListRouter }
