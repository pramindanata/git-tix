import { Router } from 'express'
import { NotFoundError } from '@teh-tix/common/exception'
import type { Request, Response } from 'express'

import { RP, RO } from '../interface'
import { Ticket } from '../models/ticket'
import { TicketDTO } from '../dto'

const router = Router()

router.get(
  '/ticket/:id',
  async (
    req: Request<RP.GetOneTicketParams>,
    res: Response<RO.Item<TicketDTO>>,
  ) => {
    const { id } = req.params
    const ticket = await Ticket.findById(id)

    if (!ticket) {
      throw new NotFoundError()
    }

    return res.json({
      data: new TicketDTO(ticket),
    })
  },
)

export { router as getOneRouter }
