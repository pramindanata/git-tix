import { Message } from 'node-nats-streaming'
import { OrderStatus } from '@teh-tix/common/constant'
import { OrderCreatedEventData } from '@teh-tix/common/pubsub'
import { OrderCreatedSubscriber } from '../order-created'
import { stan } from '../../../lib/stan'
import { Order } from '../../../models/order'
import { generateMongooseId } from '../../../test/util'

async function setup() {
  const pubMock = stan.getInstance()
  const listener = new OrderCreatedSubscriber(pubMock)
  const orderCreatedEventData: OrderCreatedEventData = {
    id: generateMongooseId(),
    expiredAt: new Date().toISOString(),
    status: OrderStatus.CREATED,
    version: 0,
    userId: 'user',
    ticket: {
      id: generateMongooseId(),
      price: 20,
    },
  }
  const message: Partial<Message> = {
    ack: jest.fn(),
  }

  return {
    listener,
    orderCreatedEventData,
    message,
  }
}

describe('# Subs: OrderCreated', () => {
  it('replicates the order info', async () => {
    const { listener, message, orderCreatedEventData } = await setup()

    await listener.handle(orderCreatedEventData, message as Message)

    const order = await Order.findById(orderCreatedEventData.id)

    expect(order).not.toBeNull()
    expect(order!.id).toEqual(orderCreatedEventData.id)
    expect(order!.price).toEqual(orderCreatedEventData.ticket.price)
  })

  it('acks the message', async () => {
    const { listener, message, orderCreatedEventData } = await setup()

    await listener.handle(orderCreatedEventData, message as Message)

    expect(message.ack).toHaveBeenCalled()
  })
})
