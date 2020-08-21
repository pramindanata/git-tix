import {
  StanClient,
  Publishable,
  Subscriber,
  Event,
} from '@teh-tix/common/pubsub'
import nodeStan from 'node-nats-streaming'
import { OrderCreatedSubscriber } from '../events/subs'

export class Stan extends StanClient {
  constructor() {
    super()

    this.createSubscribers = this._createSubscribers
  }

  private _createSubscribers(stan: nodeStan.Stan): Subscriber<Event>[] {
    return [new OrderCreatedSubscriber(stan)]
  }
}

export const stan = new Stan()
