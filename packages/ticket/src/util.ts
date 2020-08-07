import { TicketDocument } from './models/ticket'
import type { TicketResDTO } from './interface'

export class TicketMapper {
  static toDTO(ticket: TicketDocument): TicketResDTO {
    return {
      id: ticket._id,
      title: ticket.title,
      price: ticket.price,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    }
  }
}
