import type { ValidationError } from 'express-validator'
import type { ValidationErrorBody, ValidationErrorItem } from '../interface'
import { CustomError } from '../abstract'

export class RequestValidationError extends CustomError<ValidationErrorBody> {
  private errors: ValidationError[]
  private statusCode: number

  constructor(errors: ValidationError[]) {
    super('Invalid request parameter(s)')

    this.errors = errors
    this.statusCode = 422
  }

  private mapErrors(): ValidationErrorItem[] {
    return this.errors.map((error) => ({
      message: error.msg,
      field: error.param,
    }))
  }

  getStatusCode(): number {
    return this.statusCode
  }

  serialize(): ValidationErrorBody {
    const errorItems = this.mapErrors()

    return {
      data: errorItems,
    }
  }
}
