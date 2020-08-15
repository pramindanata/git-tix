import { Publisher, Subject, OrderCreatedEvent } from '@teh-tix/common/pubsub'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated
}
