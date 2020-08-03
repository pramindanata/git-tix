import { AxiosError } from 'axios';
import { HTTPCode } from '~/constant';
import { HttpError } from '~/interface';

export class AxiosErrorHandler {
  static composeDetail(
    error: AxiosError,
  ): UnauthenticatedError | ActionFailError | RequestValidationError {
    const errorStatus = error.response?.status;
    const errorData = error.response?.data;

    if (errorStatus === HTTPCode.UNAUTHORIZED) {
      return new UnauthenticatedError();
    } else if (errorStatus === HTTPCode.FORBIDDEN) {
      const { type, message } = errorData;

      return new ActionFailError(type, message);
    } else if (errorStatus === HTTPCode.UNPROCESSABLE_ENTITY) {
      return new RequestValidationError(errorData);
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
  constructor(private type: string, private message: string) {
    super();
  }

  serialize(): HttpError.ActionFailDetail {
    return {
      type: this.type,
      message: this.message,
    };
  }
}

export class RequestValidationError extends BaseHTTPError {
  constructor(private data: HttpError.RequestValidationDetail) {
    super();
  }

  serialize(): HttpError.RequestValidationDetail {
    return this.data;
  }
}

export class HTTPErrorTypeNotFoundException extends Error {
  constructor() {
    super('HTTP error type not specified on current error handler');
    this.name = 'HTTPErrorTypeNotFoundException';
  }
}

export type HttpErrorTypes =
  | UnauthenticatedError
  | RequestValidationError
  | ActionFailError;
