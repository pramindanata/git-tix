import { Message } from 'node-nats-streaming'
import { Subject, Subscriber, OrderCreatedEvent } from '@teh-tix/common/pubsub'
import { config } from '../../config'
import { expirationQueue } from '../../queues'

export class OrderCreatedSubscriber extends Subscriber<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated
  readonly queueGroupName = config.app.name

  async handle(
    data: OrderCreatedEvent['data'],
    message: Message,
  ): Promise<void> {
    const expiredAt = new Date(data.expiredAt).getTime()
    const currentTime = new Date().getTime()
    const delay = expiredAt - currentTime

    await expirationQueue.add({ orderId: data.id }, { delay })

    message.ack()
  }
}
