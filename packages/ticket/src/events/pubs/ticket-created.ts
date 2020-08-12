import { Publisher, TicketCreatedEvent, Subject } from '@teh-tix/common/pubsub'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subject.TicketCreated
}
