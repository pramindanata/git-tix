type ActionFailMessageDict = {
  [key in keyof typeof ActionFailType]: string;
};

export enum ActionFailType {
  EMAIL_TAKEN = 'EMAIL_TAKEN',
  INVALID_CREDENTIAL = 'INVALID_CREDENTIAL',
  NO_TOKEN = 'NO_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  FORBIDDEN = 'FORBIDDEN',
  RESERVED_TICKET = 'RESERVED_TICKET',
  TICKET_NOT_FOUND = 'TICKET_NOT_FOUND',
}

export const actionFailMessageDict: ActionFailMessageDict = {
  EMAIL_TAKEN: 'Email is already taken',
  INVALID_CREDENTIAL: 'Invalid email or password given',
  NO_TOKEN: 'No token given',
  INVALID_TOKEN: 'Invalid token given',
  FORBIDDEN: 'Resource access is forbidden',
  RESERVED_TICKET: 'Ticket is still reserved',
  TICKET_NOT_FOUND: 'Ticket is not found',
};
