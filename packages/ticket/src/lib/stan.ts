import { StanClient, Publishable } from '@teh-tix/common/pubsub'
import * as pubs from '../events/pubs'

type PublisherDict = {
  ticketCreatedPub: pubs.TicketCreatedPublisher
  ticketUpdatedPub: pubs.TicketUpdatedPublisher
}

export class Stan extends StanClient implements Publishable {
  private pubs?: PublisherDict

  constructor() {
    super()
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
}

export const stan = new Stan()
