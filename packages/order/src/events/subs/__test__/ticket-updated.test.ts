import type { TicketUpdatedEventData } from '@teh-tix/common/pubsub'
import type { Message } from 'node-nats-streaming'

import { TicketUpdatedSubscriber } from '../ticket-updated'
import { stan } from '../../../lib/stan'
import { generateMongooseId } from '../../../test/util'
import { Ticket } from '../../../models/ticket'

async function setup() {
  const conMock = stan.getInstance()
  const listener = new TicketUpdatedSubscriber(conMock)
  const createdTicket = Ticket.build({
    id: generateMongooseId(),
    title: 'test',
    price: 10,
  })

  await createdTicket.save()

  const ticketEventData: TicketUpdatedEventData = {
    id: createdTicket.id,
    title: 'new title',
    price: 20,
    userId: 'user',
    version: createdTicket.version + 1,
  }
  const message: Partial<Message> = {
    ack: jest.fn(),
  }

  return {
    listener,
    createdTicket,
    ticketEventData,
    message,
  }
}

describe('# Subs: TicketUpdated', () => {
  it('finds, updates, and saves a ticket', async () => {
    const { listener, message, ticketEventData, createdTicket } = await setup()

    await listener.handle(ticketEventData, message as Message)

    const updatedTicket = await Ticket.findById(createdTicket.id)

    expect(updatedTicket!.title).toEqual(ticketEventData.title)
    expect(updatedTicket!.price).toEqual(ticketEventData.price)
    expect(updatedTicket!.version).toEqual(ticketEventData.version)
  })

  it('acks the message', async () => {
    const { listener, message, ticketEventData } = await setup()

    await listener.handle(ticketEventData, message as Message)

    expect(message.ack).toHaveBeenCalled()
  })

  it('does not ack if the event is out of order', async () => {
    const { listener, message, ticketEventData } = await setup()

    ticketEventData.version = 10

    try {
      await listener.handle(ticketEventData, message as Message)
    } catch (err) {}

    expect(message.ack).not.toHaveBeenCalled()
  })
})
