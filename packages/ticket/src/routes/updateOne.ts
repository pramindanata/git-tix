import { Router } from 'express'
import { body } from 'express-validator'
import { NotFoundError, ActionFailError, ActionFailType } from '@teh-tix/common'
import { validateRequestPayload, auth } from '@teh-tix/common/middleware'
import type { Request, Response } from 'express'

import { Ticket } from '../models/ticket'
import { stan } from '../lib/stan'
import { TicketDTO, TicketUpdatedEventDTO } from '../dto'
import type { RP, RO } from '../interface'

const router = Router()

router.put(
  '/ticket/:id',
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
    res: Response<RO.Item<TicketDTO>>,
  ) => {
    const { id } = req.params
    const { price, title } = req.body
    const { authUser } = req.ctx
    const ticket = await Ticket.findById(id)

    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.userId !== authUser!.id) {
      throw new ActionFailError(ActionFailType.FORBIDDEN)
    }

    if (ticket.orderId) {
      throw new ActionFailError(ActionFailType.RESERVED_TICKET)
    }

    ticket.set({
      price,
      title,
    })

    await ticket.save()

    const ticketDTO = new TicketDTO(ticket)
    const ticketUpdatedEventDTO = new TicketUpdatedEventDTO(ticket)

    await stan.getPubs().ticketUpdatedPub.publish(ticketUpdatedEventDTO)

    return res.json({
      data: ticketDTO,
    })
  },
)

export { router as updateOneRouter }
