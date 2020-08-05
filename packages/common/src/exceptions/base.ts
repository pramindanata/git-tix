export abstract class BaseError<ErrorBody> extends Error {
  abstract getStatusCode(): number;
  abstract serialize(): ErrorBody;

  constructor(message?: string) {
    super(message);
  }
}
