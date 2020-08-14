import { Router } from 'express'
import { OrderMapper } from '../util'
import type { Request, Response } from 'express'
import type { DTO, RO, RP } from '../interface'

const router = Router()

router.get(
  '/:orderId',
  async (
    req: Request<RP.GetOneOrderParams>,
    res: Response<RO.Item<DTO.Order>>,
  ) => {
    // const { orderId } = req.params
    const order: DTO.Order = { id: 'id' }

    return res.json({
      data: OrderMapper.toDTO(order),
    })
  },
)

export { router as getOrderDetailRouter }
