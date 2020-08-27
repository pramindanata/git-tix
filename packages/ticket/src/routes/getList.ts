import { Router } from 'express'
import type { Response } from 'express'

import { TicketDTO } from '../dto'
import { Ticket } from '../models/ticket'
import { RO } from '../interface'

const router = Router()

router.get('/', async (req, res: Response<RO.List<TicketDTO>>) => {
  const tickets = await Ticket.find({
    orderId: undefined,
  })

  return res.json({
    data: tickets.map((ticket) => new TicketDTO(ticket)),
  })
})

export { router as getListRouter }
