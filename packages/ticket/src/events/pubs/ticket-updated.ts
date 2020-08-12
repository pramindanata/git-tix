import { Publisher, TicketUpdatedEvent, Subject } from '@teh-tix/common/pubsub'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subject.TicketUpdated
}
