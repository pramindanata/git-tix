import { Router } from 'express'
import { body } from 'express-validator'
import { auth, validateRequestPayload } from '@teh-tix/common/middleware'
import type { Response, Request } from 'express'

import { Ticket } from '../models/ticket'
import { stan } from '../lib/stan'
import { TicketDTO, TicketCreatedEventDTO } from '../dto'
import type { RP, RO } from '../interface'

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
  async (
    req: Request<any, any, RP.CreateTicketBody>,
    res: Response<RO.Item<TicketDTO>>,
  ) => {
    const { title, price } = req.body
    const { id } = req.ctx.authUser!
    const ticket = Ticket.build({ title, price, userId: id })

    await ticket.save()

    const ticketDTO = new TicketDTO(ticket)
    const ticketCreatedEventDTO = new TicketCreatedEventDTO(ticket)

    await stan.getPubs().ticketCreatedPub.publish(ticketCreatedEventDTO)

    return res.json({
      data: ticketDTO,
    })
  },
)

export { router as createTicketRouter }
