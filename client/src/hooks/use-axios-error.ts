import { AxiosError } from 'axios';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import {
  HttpErrorTypes,
  ActionFailError,
  RequestValidationError,
  UnauthenticatedError,
  AxiosErrorTypeFactory,
} from '~/utils';

interface ErrorResult {
  actionFail?: ActionFailError;
  requestValidation?: RequestValidationError;
  unauthenticated?: UnauthenticatedError;
}
type ResetType = 'all' | 'actionFail' | 'requestValidation' | 'unauthenticated';
type SetAxiosErrorFn = Dispatch<SetStateAction<AxiosError | null>>;
type ResetFn = (type?: ResetType) => void;

export const useAxiosError = (): [ErrorResult, SetAxiosErrorFn, ResetFn] => {
  const initialError: ErrorResult = {
    actionFail: undefined,
    requestValidation: undefined,
    unauthenticated: undefined,
  };
  const [error, setError] = useState<ErrorResult>(initialError);
  const [axiosError, setAxiosError] = useState<AxiosError | null>(null);

  useEffect(() => {
    if (axiosError) {
      const httpError = AxiosErrorTypeFactory.produce(axiosError);

      specifyError(httpError);
    }
  }, [axiosError]);

  function specifyError(httpError: HttpErrorTypes): void {
    const curError: ErrorResult = { ...error };

    if (httpError instanceof ActionFailError) {
      curError.actionFail = httpError;
    } else if (httpError instanceof RequestValidationError) {
      curError.requestValidation = httpError;
    } else if (httpError instanceof UnauthenticatedError) {
      curError.unauthenticated = httpError;
    }

    setError(curError);
  }

  function reset(type: ResetType = 'all') {
    let curError: ErrorResult = error;

    if (type === 'all') {
      curError = {
        ...initialError,
      };
    } else if (type === 'actionFail') {
      curError.actionFail = undefined;
    } else if (type === 'requestValidation') {
      curError.requestValidation = undefined;
    } else if (type === 'unauthenticated') {
      curError.unauthenticated = undefined;
    }

    setError({
      ...curError,
    });
  }

  return [error, setAxiosError, reset];
};
