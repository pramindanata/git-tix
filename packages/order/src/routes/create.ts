import { Router } from 'express'
import { Types } from 'mongoose'
import { body } from 'express-validator'
import { auth, validateRequestPayload } from '@teh-tix/common/middleware'
import { OrderMapper } from '../util'
import type { Request, Response } from 'express'
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
    // const { ticketId } = req.body
    const order: DTO.Order = { id: 'id' }

    return res.json({
      data: OrderMapper.toDTO(order),
    })
  },
)

export { router as createOrderRouter }
