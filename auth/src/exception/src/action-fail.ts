import { BaseError } from './base'
import type { ActionFailBody, ActionFailType } from '../interface'

export class ActionFailError extends BaseError<ActionFailBody> {
  private statusCode: number
  private type: ActionFailType

  constructor(type: ActionFailType) {
    super()

    this.type = type
    this.statusCode = 403

    this.setMessage()
  }

  private setMessage(): void {
    if (this.type === 'EMAIL_TAKEN') {
      this.message = 'Email is already taken'
    } else if (this.type === 'INVALID_CREDENTIAL') {
      this.message = 'Invalid email or password given'
    }
  }

  getStatusCode(): number {
    return this.statusCode
  }

  serialize(): ActionFailBody {
    return {
      type: this.type,
      message: this.message,
    }
  }
}
