import { Message } from 'node-nats-streaming'
import { OrderStatus } from '@teh-tix/common/constant'
import { ExpirationCompleteEvent } from '@teh-tix/common/pubsub'
import { ExpirationCompleteSubscriber } from '../expiration-complete'
import { stan } from '../../../lib/stan'
import { Ticket } from '../../../models/ticket'
import { Order } from '../../../models/order'
import { generateMongooseId } from '../../../test/util'
import { OrderCancelledEventDTO } from '../../../dto'

async function setup() {
  const stanMock = stan.getInstance()
  const listener = new ExpirationCompleteSubscriber(stanMock)

  const createdTicket = Ticket.build({
    title: 'test',
    price: 200,
    id: generateMongooseId(),
  })

  await createdTicket.save()

  const createdOrder = Order.build({
    userId: 'user',
    expiredAt: new Date(),
    status: OrderStatus.CREATED,
    ticket: createdTicket,
  })

  await createdOrder.save()

  const expirationCompleteEventData: ExpirationCompleteEvent['data'] = {
    orderId: createdOrder.id,
  }

  const message: Partial<Message> = {
    ack: jest.fn(),
  }

  return {
    listener,
    createdOrder,
    createdTicket,
    expirationCompleteEventData,
    message,
  }
}

describe('# Subs: ExpirationComplete', () => {
  it('updates the order status to cancelled', async () => {
    const {
      createdOrder,
      expirationCompleteEventData,
      listener,
      message,
    } = await setup()

    await listener.handle(expirationCompleteEventData, message as Message)

    const updatedOrder = await Order.findById(createdOrder.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED)
  })

  it('emits an OrderCancelled event', async () => {
    const {
      createdOrder,
      expirationCompleteEventData,
      listener,
      message,
    } = await setup()

    await listener.handle(expirationCompleteEventData, message as Message)

    const orderCancelledPubMock = jest.spyOn(
      stan.getPubs().orderCancelledPub,
      'publish',
    )
    const orderCancelledPubData = orderCancelledPubMock.mock
      .calls[0][0] as OrderCancelledEventDTO

    expect(orderCancelledPubMock).toHaveBeenCalled()
    expect(orderCancelledPubData.id).toEqual(createdOrder.id)
  })

  it('ack the message', async () => {
    const { expirationCompleteEventData, listener, message } = await setup()

    await listener.handle(expirationCompleteEventData, message as Message)

    expect(message.ack).toHaveBeenCalled()
  })
})
