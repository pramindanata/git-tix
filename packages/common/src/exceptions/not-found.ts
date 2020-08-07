import { BaseError } from './base';
import type { MessageOnlyBody } from '../interface';

export class NotFoundError extends BaseError<MessageOnlyBody> {
  private statusCode = 404;

  constructor() {
    super('Route not found');
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  serialize(): MessageOnlyBody {
    return {
      message: 'Route not found',
    };
  }
}
