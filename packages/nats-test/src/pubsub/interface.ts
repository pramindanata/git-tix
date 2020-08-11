import { Subject } from './constant'

export interface TicketCreatedEventData {
  id: string
  title: string
  price: number
}

export interface TicketCreatedEvent {
  subject: Subject.TicketCreated
  data: TicketCreatedEventData
}

export interface Event {
  subject: Subject
  data: any
}
