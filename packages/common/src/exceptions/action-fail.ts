import { BaseError } from './base';
import { ActionFailType, actionFailMessageDict } from './constant';
import type { ActionFailBody } from './interface';

export class ActionFailError extends BaseError<ActionFailBody> {
  private statusCode: number;
  private type: ActionFailType;

  constructor(type: ActionFailType) {
    super();

    this.type = type;
    this.statusCode = 403;

    this.setMessage();
  }

  private setMessage(): void {
    const type = this.type;

    this.message = actionFailMessageDict[type];
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  serialize(): ActionFailBody {
    return {
      type: this.type,
      message: this.message,
    };
  }
}
