import { OrderDocument } from './models/order'
import type { ObjectID } from 'mongodb'
import type { DTO } from './interface'

export class OrderMapper {
  static toDTO(order: OrderDocument): DTO.Order {
    return {
      id: (order._id as ObjectID).toHexString(),
      status: order.status,
      expiredAt: order.expiredAt && order.expiredAt.toISOString(),
    }
  }
}
