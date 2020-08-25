import {
  Subject,
  Subscriber,
  PaymentCreatedEvent,
} from '@teh-tix/common/pubsub'
import { OrderStatus } from '@teh-tix/common/constant'
import type { Message } from 'node-nats-streaming'

import { config } from '../../config'
import { Order } from '../../models/order'

export class PaymentCreatedSubscriber extends Subscriber<PaymentCreatedEvent> {
  readonly subject = Subject.PaymentCreated
  readonly queueGroupName = config.app.name

  async handle(data: PaymentCreatedEvent['data'], msg: Message): Promise<void> {
    const { orderId } = data
    const order = await Order.findById(orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    order.status = OrderStatus.COMPLETE

    await order.save()

    msg.ack()
  }
}
