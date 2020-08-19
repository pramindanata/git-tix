import type { TicketCreatedEventData } from '@teh-tix/common/pubsub'
import type { Message } from 'node-nats-streaming'

import { TicketCreatedSubscriber } from '../ticket-created'
import { stan } from '../../../lib/stan'
import { generateMongooseId } from '../../../test/util'
import { Ticket } from '../../../models/ticket'

function setup() {
  const conMock = stan.getInstance()
  const listener = new TicketCreatedSubscriber(conMock)
  const ticket: TicketCreatedEventData = {
    id: generateMongooseId(),
    title: 'test',
    price: 1200,
    userId: 'user',
    version: 0,
  }
  const message: Partial<Message> = {
    ack: jest.fn(),
  }

  return {
    listener,
    ticket,
    message,
  }
}

describe('# Subs: TicketCreated', () => {
  it('creates and saves a ticket', async () => {
    const { listener, ticket, message } = setup()

    await listener.handle(ticket, message as Message)

    const createdTicket = await Ticket.findById(ticket.id)

    expect(createdTicket).not.toBeNull()
    expect(createdTicket!.title).toEqual(ticket.title)
    expect(createdTicket!.price).toEqual(ticket.price)
  })

  it('acks the message', async () => {
    const { listener, ticket, message } = setup()

    await listener.handle(ticket, message as Message)

    expect(message.ack).toHaveBeenCalled()
  })
})
