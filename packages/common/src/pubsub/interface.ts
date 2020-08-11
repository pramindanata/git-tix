import { Subject } from './constant';

export interface Event {
  subject: Subject;
  data: any;
}

export interface TicketCreatedEvent {
  subject: Subject.TicketCreated;
  data: TicketCreatedEventData;
}

export interface TicketCreatedEventData {
  id: string;
  title: string;
  price: number;
  userId: string;
}

export interface TicketUpdatedEvent {
  subject: Subject.TicketUpdated;
  data: TicketUpdatedEventData;
}

export interface TicketUpdatedEventData {
  id: string;
  title: string;
  price: number;
  userId: string;
}
