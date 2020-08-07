import { Router } from 'express'
import type { Request, Response } from 'express'
import { NotFoundError } from '@teh-tix/common/exception'
import { RP, RO, DTO } from '../interface'
import { Ticket } from '../models/ticket'
import { TicketMapper } from '../util'

const router = Router()

router.get(
  '/:id',
  async (
    req: Request<RP.GetOneTicketParams>,
    res: Response<RO.Item<DTO.Ticket>>,
  ) => {
    const { id } = req.params
    const ticket = await Ticket.findById(id)

    if (!ticket) {
      throw new NotFoundError()
    }

    return res.json({
      data: TicketMapper.toDTO(ticket),
    })
  },
)

export { router as getOneRouter }
