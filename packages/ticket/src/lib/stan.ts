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
      this.initPubs()
    }

    return this.pubs!
  }

  private initPubs(): void {
    const connection = this.getConnection()

    this.pubs = {
      ticketCreatedPub: new pubs.TicketCreatedPublisher(connection),
      ticketUpdatedPub: new pubs.TicketUpdatedPublisher(connection),
    }
  }
}

export const stan = new Stan()
