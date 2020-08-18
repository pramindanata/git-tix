import {
  StanClient,
  Publishable,
  Subscriber,
  Event,
} from '@teh-tix/common/pubsub'
import nodeStan from 'node-nats-streaming'

import { OrderCancelledPublisher, OrderCreatedPublisher } from '../events/pubs'
import {
  TicketCreatedSubscriber,
  TicketUpdatedSubscriber,
} from '../events/subs'

type PublisherDict = {
  orderCreatedPub: OrderCreatedPublisher
  orderCancelledPub: OrderCancelledPublisher
}

export class Stan extends StanClient implements Publishable {
  private pubs?: PublisherDict

  constructor() {
    super()

    this.createSubscribers = this._createSubscribers
  }

  getPubs(): PublisherDict {
    if (!this.pubs) {
      this.setPubs()
    }

    return this.pubs!
  }

  private setPubs(): void {
    const stan = this.getInstance()

    this.pubs = {
      orderCreatedPub: new OrderCreatedPublisher(stan),
      orderCancelledPub: new OrderCancelledPublisher(stan),
    }
  }

  private _createSubscribers(stan: nodeStan.Stan): Subscriber<Event>[] {
    return [
      new TicketCreatedSubscriber(stan),
      new TicketUpdatedSubscriber(stan),
    ]
  }
}

export const stan = new Stan()
