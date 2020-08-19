import nodeStan from 'node-nats-streaming'
import { StanClient, Publishable, Subscriber } from '@teh-tix/common/pubsub'
import type { Event } from '@teh-tix/common/pubsub'
import * as pubs from '../events/pubs'
import * as subs from '../events/subs'

type PublisherDict = {
  ticketCreatedPub: pubs.TicketCreatedPublisher
  ticketUpdatedPub: pubs.TicketUpdatedPublisher
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
    const connection = this.getInstance()

    this.pubs = {
      ticketCreatedPub: new pubs.TicketCreatedPublisher(connection),
      ticketUpdatedPub: new pubs.TicketUpdatedPublisher(connection),
    }
  }

  private _createSubscribers(stan: nodeStan.Stan): Subscriber<Event>[] {
    return [new subs.OrderCreatedSubscriber(stan)]
  }
}

export const stan = new Stan()
