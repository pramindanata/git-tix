import { Subject, Subscriber, TicketCreatedEvent } from '@teh-tix/common/pubsub'
import type { Message } from 'node-nats-streaming'

import { config } from '../../config'
import { Ticket } from '../../models/ticket'

export class TicketCreatedSubscriber extends Subscriber<TicketCreatedEvent> {
  readonly subject = Subject.TicketCreated
  readonly queueGroupName = config.app.name

  async handle(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
    const { id, title, price } = data
    const ticket = Ticket.build({ id, title, price })

    await ticket.save()

    msg.ack()
  }
}
