import { OrderCreatedEventData } from '@teh-tix/common/pubsub'
import { OrderStatus } from '@teh-tix/common/constant'
import type { Message } from 'node-nats-streaming'

import { OrderCreatedSubscriber } from '../order-created'
import { stan } from '../../../lib/stan'
import { Ticket } from '../../../models/ticket'
import { generateMongooseId } from '../../../test/util'
import { TicketUpdatedEventDTO } from '../../../dto'

async function setup() {
  const stanMock = stan.getInstance()
  const listener = new OrderCreatedSubscriber(stanMock)

  const createdTicket = Ticket.build({
    title: 'test',
    price: 10,
    userId: 'user',
  })

  await createdTicket.save()

  const orderCreatedEventData: OrderCreatedEventData = {
    id: generateMongooseId(),
    status: OrderStatus.CREATED,
    userId: 'user',
    expiredAt: new Date().toISOString(),
    version: 0,
    ticket: {
      id: createdTicket.id,
      price: createdTicket.price,
    },
  }

  const message: Partial<Message> = {
    ack: jest.fn(),
  }

  return {
    listener,
    createdTicket,
    orderCreatedEventData,
    message,
  }
}

describe('# Subs: OrderCreated', () => {
  it('set the orderId of the ticket', async () => {
    const {
      listener,
      createdTicket,
      message,
      orderCreatedEventData,
    } = await setup()

    await listener.handle(orderCreatedEventData, message as Message)

    const updatedTicket = await Ticket.findById(createdTicket.id)

    expect(updatedTicket!.orderId).toEqual(orderCreatedEventData.id)
  })

  it('acks the message', async () => {
    const { listener, message, orderCreatedEventData } = await setup()

    await listener.handle(orderCreatedEventData, message as Message)

    expect(message.ack).toHaveBeenCalled()
  })

  it.only('publishes a ticket updated event', async () => {
    const { listener, message, orderCreatedEventData } = await setup()
    const ticketUpdatedPubMock = jest.spyOn(
      stan.getPubs().ticketUpdatedPub,
      'publish',
    )

    await listener.handle(orderCreatedEventData, message as Message)

    const ticketUpdatedEventPayload = ticketUpdatedPubMock.mock
      .calls[0][0] as TicketUpdatedEventDTO

    expect(ticketUpdatedPubMock).toHaveBeenCalled()
    expect(ticketUpdatedEventPayload instanceof TicketUpdatedEventDTO).toEqual(
      true,
    )
    expect(ticketUpdatedEventPayload.orderId).toEqual(orderCreatedEventData.id)
  })
})
