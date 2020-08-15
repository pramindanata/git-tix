import { Publisher, Subject, OrderCancelledEvent } from '@teh-tix/common/pubsub'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subject.OrderCancelled
}
