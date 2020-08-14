import { TicketDocument } from './models/ticket'
import type { ObjectID } from 'mongodb'
import type { DTO } from './interface'

// export class TicketMapper {
//   static toDTO(ticket: TicketDocument): DTO.Ticket {
//     return {
//       id: (ticket._id as ObjectID).toHexString(),
//       title: ticket.title,
//       price: ticket.price,
//       userId: ticket.userId,
//       createdAt: ticket.createdAt.toISOString(),
//     }
//   }
// }
