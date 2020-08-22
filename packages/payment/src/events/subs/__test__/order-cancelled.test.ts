import { Message } from 'node-nats-streaming'
import { OrderCancelledEventData } from '@teh-tix/common/pubsub'
import { OrderStatus } from '@teh-tix/common/constant'
import { OrderCancelledSubscriber } from '../../subs'
import { stan } from '../../../lib/stan'
import { Order } from '../../../models/order'
import { generateMongooseId } from '../../../test/util'

async function setup() {
  const stanMock = stan.getInstance()
  const listener = new OrderCancelledSubscriber(stanMock)

  const orderId = generateMongooseId()
  const createdOrder = Order.build({
    price: 20,
    status: OrderStatus.CREATED,
    userId: 'user',
    version: 0,
    id: orderId,
  })

  await createdOrder.save()

  const orderCancelledEventData: OrderCancelledEventData = {
    id: orderId,
    version: 1,
    ticket: {
      id: generateMongooseId(),
    },
  }

  const message: Partial<Message> = {
    ack: jest.fn(),
  }

  return {
    listener,
    createdOrder,
    orderCancelledEventData,
    message,
  }
}

describe('# Subs: OrderCancelled', () => {
  it('update the status of the order', async () => {
    const {
      createdOrder,
      listener,
      message,
      orderCancelledEventData,
    } = await setup()

    await listener.handle(orderCancelledEventData, message as Message)

    const updatedOrder = await Order.findById(createdOrder.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED)
  })

  it('acks the message', async () => {
    const { listener, message, orderCancelledEventData } = await setup()

    await listener.handle(orderCancelledEventData, message as Message)

    expect(message.ack).toHaveBeenCalled()
  })
})
