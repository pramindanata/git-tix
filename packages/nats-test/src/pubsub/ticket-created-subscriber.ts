import nodeStan from 'node-nats-streaming'
import { Subscriber } from './subscriber'
import { TicketCreatedEvent } from './interface'
import { Subject } from './constant'

export class TicketCreatedSubscriber extends Subscriber<TicketCreatedEvent> {
  readonly subject = Subject.TicketCreated
  readonly queueGroupName = 'q.payment-service'

  handle(data: TicketCreatedEvent['data'], msg: nodeStan.Message): void {
    console.log('yikes', data)

    msg.ack()
  }
}
