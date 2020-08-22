import { Subscriber, Subject, OrderCreatedEvent } from '@teh-tix/common/pubsub'
import { Message } from 'node-nats-streaming'
import { config } from '../../config'
import { Order } from '../../models/order'

export class OrderCreatedSubscriber extends Subscriber<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated
  readonly queueGroupName = config.app.name

  async handle(
    data: OrderCreatedEvent['data'],
    message: Message,
  ): Promise<void> {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    })

    await order.save()

    message.ack()
  }
}
