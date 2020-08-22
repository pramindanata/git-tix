import {
  Subscriber,
  Subject,
  OrderCancelledEvent,
} from '@teh-tix/common/pubsub'
import { OrderStatus } from '@teh-tix/common/constant'
import { Message } from 'node-nats-streaming'
import { config } from '../../config'
import { Order } from '../../models/order'

export class OrderCancelledSubscriber extends Subscriber<OrderCancelledEvent> {
  readonly subject = Subject.OrderCancelled
  readonly queueGroupName = config.app.name

  async handle(
    data: OrderCancelledEvent['data'],
    message: Message,
  ): Promise<void> {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    })

    if (!order) {
      throw new Error('Order does not foudn')
    }

    order.status = OrderStatus.CANCELLED

    await order.save()

    message.ack()
  }
}
