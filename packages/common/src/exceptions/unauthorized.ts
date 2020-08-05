import { BaseError } from './base';

export class UnauthorizedError extends BaseError<string> {
  private statusCode: number;

  constructor() {
    super('Unauthorized');

    this.statusCode = 401;
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  serialize(): string {
    return 'Unauthorized';
  }
}
