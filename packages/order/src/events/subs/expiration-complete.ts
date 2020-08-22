import {
  Subscriber,
  Subject,
  ExpirationCompleteEvent,
} from '@teh-tix/common/pubsub'
import { OrderStatus } from '@teh-tix/common/constant'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'
import { config } from '../../config'
import { stan } from '../../lib/stan'
import { OrderCancelledEventDTO } from '../../dto'

export class ExpirationCompleteSubscriber extends Subscriber<
  ExpirationCompleteEvent
> {
  readonly subject = Subject.ExpirationComplete
  readonly queueGroupName = config.app.name

  async handle(
    data: ExpirationCompleteEvent['data'],
    message: Message,
  ): Promise<void> {
    const order = await Order.findById(data.orderId).populate('ticket')

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status === OrderStatus.COMPLETE) {
      return message.ack()
    }

    order.set({
      status: OrderStatus.CANCELLED,
    })

    await order.save()

    const orderCancelledDTO = new OrderCancelledEventDTO(order)

    await stan.getPubs().orderCancelledPub.publish(orderCancelledDTO)

    message.ack()
  }
}
