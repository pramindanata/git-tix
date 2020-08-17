import { Subject, Subscriber, TicketUpdatedEvent } from '@teh-tix/common/pubsub'
import type { Message } from 'node-nats-streaming'

import { config } from '../../config'
import { Ticket } from '../../models/ticket'

export class TicketUpdatedSubscriber extends Subscriber<TicketUpdatedEvent> {
  readonly subject = Subject.TicketUpdated
  readonly queueGroupName = config.app.name

  async handle(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
    const { id, title, price } = data
    const ticket = await Ticket.findById(id)

    if (!ticket) {
      // throw new Error('Ticket not found')
      msg.ack()

      return
    }

    ticket.set({
      title,
      price,
    })

    await ticket.save()

    msg.ack()
  }
}
