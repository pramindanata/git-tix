import { AxiosError } from 'axios';
import { HTTPCode } from '~/constant';
import { HttpError, Dto } from '~/interfaces';

export class AxiosErrorTypeFactory {
  static produce(
    error: AxiosError,
  ): UnauthenticatedError | ActionFailError | RequestValidationError {
    const errorStatus = error.response?.status;
    const errorData = error.response?.data;

    if (errorStatus === HTTPCode.UNAUTHORIZED) {
      return new UnauthenticatedError();
    } else if (errorStatus === HTTPCode.FORBIDDEN) {
      const data = errorData as Dto.ActionFailRes;

      return new ActionFailError(data);
    } else if (errorStatus === HTTPCode.UNPROCESSABLE_ENTITY) {
      const data = errorData as Dto.RequestValidationRes;

      return new RequestValidationError(data);
    }

    throw new HTTPErrorTypeNotFoundException();
  }
}

abstract class BaseHTTPError {
  abstract serialize(): any;
}

export class UnauthenticatedError extends BaseHTTPError {
  constructor() {
    super();
  }

  serialize(): string {
    return 'Unauthorized';
  }
}

export class ActionFailError extends BaseHTTPError {
  private type: string;
  private message: string;

  constructor(data: Dto.ActionFailRes) {
    super();

    this.type = data.type;
    this.message = data.message;
  }

  serialize(): HttpError.SerializedActionFailDetail {
    return {
      type: this.type,
      message: this.message,
    };
  }
}

export class RequestValidationError extends BaseHTTPError {
  private list: HttpError.SerializedRequestValidationDetail;
  constructor(data: Dto.RequestValidationRes) {
    super();

    this.list = data.data;
  }

  serialize(): HttpError.SerializedRequestValidationDetail {
    return this.list;
  }
}

export class HTTPErrorTypeNotFoundException extends Error {
  constructor() {
    super('HTTP error type not specified on current error handler');
    this.name = 'HTTPErrorTypeNotFoundException';
  }
}

export type HttpErrorType =
  | UnauthenticatedError
  | RequestValidationError
  | ActionFailError;
