import { Router } from 'express'
import type { Response } from 'express'
import { Ticket } from '../models/ticket'
import { TicketMapper } from '../util'
import { RO, DTO } from '../interface'

const router = Router()

router.get('/', async (req, res: Response<RO.List<DTO.Ticket>>) => {
  const tickets = await Ticket.find()

  return res.json({
    data: tickets.map(TicketMapper.toDTO),
  })
})

export { router as getListRouter }
