import { Router } from 'express'
import { OrderMapper } from '../util'
import type { Response } from 'express'
import type { DTO, RO } from '../interface'

const router = Router()

router.get('/', async (req, res: Response<RO.List<DTO.Order>>) => {
  const orders: DTO.Order[] = [{ id: 'id' }]

  return res.json({
    data: orders.map(OrderMapper.toDTO),
  })
})

export { router as getOrderListRouter }
