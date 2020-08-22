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
    const expiredOrder = await Order.findById(data.orderId).populate('ticket')

    if (!expiredOrder) {
      throw new Error('Order not found')
    }

    expiredOrder.set({
      status: OrderStatus.CANCELLED,
    })

    await expiredOrder.save()

    const orderCancelledDTO = new OrderCancelledEventDTO(expiredOrder)

    await stan.getPubs().orderCancelledPub.publish(orderCancelledDTO)

    message.ack()
  }
}
