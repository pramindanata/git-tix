import { Message } from 'node-nats-streaming'
import { Subscriber, Subject } from '@teh-tix/common/pubsub'
import type { OrderCancelledEvent } from '@teh-tix/common/pubsub'
import { config } from '../../config'
import { Ticket } from '../../models/ticket'
import { stan } from '../../lib/stan'
import { TicketUpdatedEventDTO } from '../../dto'

export class OrderCancelledSubscriber extends Subscriber<OrderCancelledEvent> {
  readonly subject = Subject.OrderCancelled
  readonly queueGroupName = config.app.name

  async handle(
    data: OrderCancelledEvent['data'],
    message: Message,
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({
      orderId: undefined,
    })

    await ticket.save()

    const ticketUpdatedEvent = new TicketUpdatedEventDTO(ticket)

    await stan.getPubs().ticketUpdatedPub.publish(ticketUpdatedEvent)

    message.ack()
  }
}
