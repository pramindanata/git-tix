import { TicketDocument } from './models/ticket'
import type { TicketCatalogDTO } from './interface'

export class TicketMapper {
  static toCatalogDTO(ticket: TicketDocument): TicketCatalogDTO {
    return {
      id: ticket._id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      createdAt: ticket.createdAt,
    }
  }
}
