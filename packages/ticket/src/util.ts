import { TicketDocument } from './models/ticket'
import type { DTO } from './interface'

export class TicketMapper {
  static toCatalogDTO(ticket: TicketDocument): DTO.TicketCatalog {
    return {
      id: ticket._id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      createdAt: ticket.createdAt,
    }
  }
}
