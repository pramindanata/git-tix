import type { ValidationError } from 'express-validator';

import { BaseError } from './base';
import type { ValidationErrorBody, ValidationErrorItem } from './interface';

export class RequestValidationError extends BaseError<ValidationErrorBody> {
  private errors: ValidationError[];
  private statusCode: number;

  constructor(errors: ValidationError[]) {
    super('Invalid request parameter(s)');

    this.errors = errors;
    this.statusCode = 422;
  }

  private mapErrors(): ValidationErrorItem[] {
    return this.errors.map((error) => ({
      message: error.msg,
      field: error.param,
    }));
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  serialize(): ValidationErrorBody {
    const errorItems = this.mapErrors();

    return {
      data: errorItems,
    };
  }
}
