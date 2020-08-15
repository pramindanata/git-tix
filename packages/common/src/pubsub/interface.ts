import { Subject } from './constant';
import { OrderStatus } from '../constant';

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

export interface OrderCreatedEvent {
  subject: Subject.OrderCreated;
  data: OrderCreatedEventData;
}

export interface OrderCreatedEventData {
  id: string;
  status: OrderStatus;
  userId: string;
  expiredAt: string;
  ticket: {
    id: string;
    price: number;
  };
}

export interface OrderCancelledEvent {
  subject: Subject.OrderCancelled;
  data: OrderCancelledEventData;
}

export interface OrderCancelledEventData {
  id: string;
  ticket: {
    id: string;
  };
}
