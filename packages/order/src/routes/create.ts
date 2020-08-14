import { Router } from 'express'
import { OrderMapper } from '../util'
import type { Request, Response } from 'express'
import type { DTO, RO, RP } from '../interface'

const router = Router()

router.post(
  '/',
  async (
    req: Request<any, any, RP.CreateOrderBody>,
    res: Response<RO.Item<DTO.Order>>,
  ) => {
    // const { ticketId } = req.body
    const order: DTO.Order = { id: 'id' }

    return res.json({
      data: OrderMapper.toDTO(order),
    })
  },
)

export { router as createOrderRouter }
