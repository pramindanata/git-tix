import {
  StanClient,
  Publishable,
  Subscriber,
  Event,
} from '@teh-tix/common/pubsub'
import nodeStan from 'node-nats-streaming'
import { ExpirationCompletePublisher } from '../events/pubs'
import { OrderCreatedSubscriber } from '../events/subs'

type PublisherDict = {
  expirationCompletePub: ExpirationCompletePublisher
}

export class Stan extends StanClient implements Publishable {
  private publisherDict?: PublisherDict

  constructor() {
    super()

    this.createSubscribers = this._createSubscribers
  }

  getPubs(): PublisherDict {
    if (!this.publisherDict) {
      this.setPubs()
    }

    return this.publisherDict!
  }

  private setPubs(): void {
    const stan = this.getInstance()

    this.publisherDict = {
      expirationCompletePub: new ExpirationCompletePublisher(stan),
    }
  }

  private _createSubscribers(stan: nodeStan.Stan): Subscriber<Event>[] {
    return [new OrderCreatedSubscriber(stan)]
  }
}

export const stan = new Stan()
