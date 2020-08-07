import { Router } from 'express'
import { Ticket } from '../models/ticket'
import { TicketMapper } from '../util'

const router = Router()

router.get('/', async (req, res) => {
  const tickets = await Ticket.find()

  return res.json({
    data: tickets.map(TicketMapper.toDTO),
  })
})

export { router as getListRouter }
