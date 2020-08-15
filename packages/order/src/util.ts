import { OrderDocument } from './models/order'
import { config } from './config'
import type { ObjectID } from 'mongodb'
import type { DTO } from './interface'

export class OrderMapper {
  static toDTO(order: OrderDocument): DTO.Order {
    return {
      id: (order._id as ObjectID).toHexString(),
      status: order.status,
      expiredAt: order.expiredAt && order.expiredAt.toISOString(),
      createdAt: order.createdAt.toISOString(),
      ticket: {
        id: order.ticket.id,
        title: order.ticket.title,
        price: order.ticket.price,
      },
    }
  }
}

export const generateOrderExpirationDate = (): Date => {
  const expirationDate = new Date()
  const { expirationDurationMinute } = config.domain.order

  expirationDate.setMinutes(
    expirationDate.getMinutes() + expirationDurationMinute,
  )

  return expirationDate
}
