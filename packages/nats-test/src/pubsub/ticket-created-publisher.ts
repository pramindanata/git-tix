import { Publisher } from './publisher'
import { TicketCreatedEvent } from './interface'
import { Subject } from './constant'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subject.TicketCreated
}
