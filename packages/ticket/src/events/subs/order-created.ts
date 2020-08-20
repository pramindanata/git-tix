import { Message } from 'node-nats-streaming'
import { Subscriber, Subject } from '@teh-tix/common/pubsub'
import type { OrderCreatedEvent } from '@teh-tix/common/pubsub'
import { config } from '../../config'
import { Ticket } from '../../models/ticket'
import { stan } from '../../lib/stan'
import { TicketMapper } from '../../util'

export class OrderCreatedSubscriber extends Subscriber<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated
  readonly queueGroupName = config.app.name

  async handle(
    data: OrderCreatedEvent['data'],
    message: Message,
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({
      orderId: data.id,
    })

    await ticket.save()

    const ticketDTO = TicketMapper.toDTO(ticket)

    await stan.getPubs().ticketUpdatedPub.publish({
      ...ticketDTO,
      version: ticket.version,
    })

    message.ack()
  }
}
