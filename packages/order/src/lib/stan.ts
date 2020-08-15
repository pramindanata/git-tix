import { StanClient, Publishable } from '@teh-tix/common/pubsub'
import { OrderCancelledPublisher, OrderCreatedPublisher } from '../events/pubs'

type PublisherDict = {
  orderCreatedPub: OrderCreatedPublisher
  orderCancelledPub: OrderCancelledPublisher
}

export class Stan extends StanClient implements Publishable {
  private pubs?: PublisherDict

  getPubs(): PublisherDict {
    if (!this.pubs) {
      this.initPubs()
    }

    return this.pubs!
  }

  private initPubs(): void {
    const connection = this.getConnection()

    this.pubs = {
      orderCreatedPub: new OrderCreatedPublisher(connection),
      orderCancelledPub: new OrderCancelledPublisher(connection),
    }
  }
}

export const stan = new Stan()
