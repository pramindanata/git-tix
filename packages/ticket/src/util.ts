import { TicketDocument } from './models/ticket'
import type { DTO } from './interface'

export class TicketMapper {
  static toDTO(ticket: TicketDocument): DTO.Ticket {
    return {
      id: ticket._id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      createdAt: ticket.createdAt,
    }
  }
}
