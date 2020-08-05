import { BaseError } from './base';
import type { ServerErrorBody } from '../interface';

export class DBConnectionError extends BaseError<ServerErrorBody> {
  private statusCode: number;

  constructor() {
    super('Error connection to database');

    this.statusCode = 500;
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  serialize(): ServerErrorBody {
    return {
      type: 'DB_CONNECTION_ERROR',
      message: 'Error connection to database',
    };
  }
}
