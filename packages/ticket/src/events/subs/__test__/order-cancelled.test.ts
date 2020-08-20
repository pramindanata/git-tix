import { OrderCancelledEventData } from '@teh-tix/common/pubsub'
import type { Message } from 'node-nats-streaming'

import { OrderCancelledSubscriber } from '../order-cancelled'
import { stan } from '../../../lib/stan'
import { Ticket } from '../../../models/ticket'
import { generateMongooseId } from '../../../test/util'
import { TicketUpdatedEventDTO } from '../../../dto'

async function setup() {
  const stanMock = stan.getInstance()
  const listener = new OrderCancelledSubscriber(stanMock)
  const orderId = generateMongooseId()
  const createdTicket = Ticket.build({
    title: 'test',
    price: 20,
    userId: 'user',
    orderId: orderId,
  })

  await createdTicket.save()

  const orderCancelledEventData: OrderCancelledEventData = {
    id: orderId,
    version: 0,
    ticket: {
      id: createdTicket.id,
    },
  }

  const message: Partial<Message> = {
    ack: jest.fn(),
  }

  return {
    listener,
    createdTicket,
    orderCancelledEventData,
    message,
  }
}

describe('# Subs: OrderCancelled', () => {
  it('set the orderId of the ticket', async () => {
    const {
      listener,
      createdTicket,
      message,
      orderCancelledEventData,
    } = await setup()

    await listener.handle(orderCancelledEventData, message as Message)

    const updatedTicket = await Ticket.findById(createdTicket.id)

    expect(updatedTicket!.orderId).toEqual(null)
  })

  it('acks the message', async () => {
    const { listener, message, orderCancelledEventData } = await setup()

    await listener.handle(orderCancelledEventData, message as Message)

    expect(message.ack).toHaveBeenCalled()
  })

  it('publishes a ticket updated event', async () => {
    const { listener, message, orderCancelledEventData } = await setup()
    const ticketUpdatedPubMock = jest.spyOn(
      stan.getPubs().ticketUpdatedPub,
      'publish',
    )

    await listener.handle(orderCancelledEventData, message as Message)

    const ticketUpdatedEventPayload = ticketUpdatedPubMock.mock
      .calls[0][0] as TicketUpdatedEventDTO

    expect(ticketUpdatedPubMock).toHaveBeenCalled()
    expect(ticketUpdatedEventPayload instanceof TicketUpdatedEventDTO).toEqual(
      true,
    )
    expect(ticketUpdatedEventPayload.orderId).toEqual(null)
  })
})
