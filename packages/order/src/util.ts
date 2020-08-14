// import { TicketDocument } from './models/ticket'
import type { ObjectID } from 'mongodb'
import type { DTO } from './interface'

export class OrderMapper {
  static toDTO(order: any): DTO.Order {
    return {
      id: (order._id as ObjectID).toHexString(),
    }
  }
}
