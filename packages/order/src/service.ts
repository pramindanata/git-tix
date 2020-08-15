import { OrderStatus } from '@teh-tix/common/constant'
import { TicketDocument } from './models/ticket'
import { Order, OrderDocument } from './models/order'

export const getOneReservedOrder = async (
  ticket: TicketDocument,
): Promise<OrderDocument | null> => {
  const reservedOrder = await Order.findOne({
    ticket,
    status: {
      $in: [
        OrderStatus.CREATED,
        OrderStatus.AWAITING_PAYMENT,
        OrderStatus.COMPLETE,
      ],
    },
  })

  return reservedOrder
}
