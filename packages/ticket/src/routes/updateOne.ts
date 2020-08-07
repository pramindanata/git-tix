import { Router } from 'express'
import { body } from 'express-validator'
import { NotFoundError, ActionFailError } from '@teh-tix/common'
import { auth, validateRequestPayload } from '@teh-tix/common/middleware'
import type { Request, Response } from 'express'
import type { RP, RO, DTO } from '../interface'
import { Ticket } from '../models/ticket'
import { TicketMapper } from '../util'

const router = Router()

router.put(
  '/:id',
  auth(),
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({
        gt: 0,
      })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequestPayload(),
  async (
    req: Request<RP.UpdateTicketParams, any, RP.UpdateTicketBody>,
    res: Response<RO.Item<DTO.Ticket>>,
  ) => {
    const { id } = req.params
    const { price, title } = req.body
    const { authUser } = req.ctx
    const ticket = await Ticket.findById(id)

    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.userId !== authUser!.id) {
      throw new ActionFailError('FORBIDDEN')
    }

    const updatedTicket = await Ticket.updateOne(
      { _id: ticket.id },
      { title, price },
    )

    return res.json({
      data: TicketMapper.toDTO(updatedTicket),
    })
  },
)

export { router as updateOneRouter }
