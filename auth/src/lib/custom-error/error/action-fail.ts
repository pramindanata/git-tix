import type { ActionFailBody, ActionFailType } from '../interface'
import { CustomError } from '../abstract'

export class ActionFailError extends CustomError<ActionFailBody> {
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
    }
  }

  getStatusCode(): number {
    return this.statusCode
  }

  serialize(): ActionFailBody {
    return {
      type: 'EMAIL_TAKEN',
      message: this.message,
    }
  }
}
