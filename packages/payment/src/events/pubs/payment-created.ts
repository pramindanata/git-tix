import { Subject, PaymentCreatedEvent, Publisher } from '@teh-tix/common/pubsub'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subject.PaymentCreated
}
