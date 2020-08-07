import { Router } from 'express'
import { auth, validateRequestPayload } from '@teh-tix/common/middleware'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket'
import { TicketMapper } from '../util'
import type { Response, Request } from 'express'
import type { RP } from '../interface'

const router = Router()

router.post(
  '/',
  auth(),
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than zero'),
  ],
  validateRequestPayload(),
  async (req: Request<any, any, RP.CreateTicketBody>, res: Response) => {
    const { title, price } = req.body
    const { id } = req.ctx.authUser!
    const ticket = Ticket.build({ title, price, userId: id })

    await ticket.save()

    return res.json({
      data: TicketMapper.toDTO(ticket),
    })
  },
)

export { router as createTicketRouter }
