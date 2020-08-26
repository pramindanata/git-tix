export interface SignUpRes {
  data: {
    id: string;
    email: string;
  };
}

export interface ActionFailRes {
  type: string;
  message: string;
}

export interface RequestValidationRes {
  data: {
    message: string;
    field: string;
  }[];
}

export type UnauthenticatedRes = string;

export interface CurrentUserRes {
  data: {
    id: string;
    email: string;
  };
}

export interface Ticket {
  id: string;
  title: string;
  price: number;
  userId: string;
  createdAt: string;
}

export interface CreateTicketRes {
  data: Ticket;
}

export interface TicketListRes {
  data: Ticket[];
}
