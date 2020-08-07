import { Router } from 'express'
import type { Request, Response } from 'express'
import { NotFoundError } from '@teh-tix/common/exception'
import { RequestPayload } from '../interface'
import { Ticket } from '../models/ticket'
import { TicketMapper } from '../util'

const router = Router()

router.get(
  '/:id',
  async (req: Request<RequestPayload.GetOneTicketParams>, res: Response) => {
    const { id } = req.params
    const ticket = await Ticket.findById(id)

    if (!ticket) {
      throw new NotFoundError()
    }

    return res.json({
      data: TicketMapper.toCatalogDTO(ticket),
    })
  },
)

export { router as GetOnRouter }
