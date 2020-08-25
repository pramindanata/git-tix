import {
  StanClient,
  Publishable,
  Subscriber,
  Event,
} from '@teh-tix/common/pubsub'
// import nodeStan from 'node-nats-streaming'
import nodeStan from 'node-nats-streaming'
import {
  OrderCreatedSubscriber,
  OrderCancelledSubscriber,
} from '../events/subs'
import { PaymentCreatedPublisher } from '../events/pubs'

type PublisherDict = {
  paymentCreatedPub: PaymentCreatedPublisher
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
      paymentCreatedPub: new PaymentCreatedPublisher(stan),
    }
  }

  private _createSubscribers(stan: nodeStan.Stan): Subscriber<Event>[] {
    return [
      new OrderCreatedSubscriber(stan),
      new OrderCancelledSubscriber(stan),
    ]
  }
}

export const stan = new Stan()
