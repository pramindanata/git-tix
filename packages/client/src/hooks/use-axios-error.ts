import { AxiosError } from 'axios';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { HttpErrorType, AxiosErrorTypeFactory } from '~/utils';

type SetAxiosErrorFn = Dispatch<SetStateAction<AxiosError | null>>;
type ResetErrorFn = () => void;

export const useAxiosError = (): [
  HttpErrorType | null,
  SetAxiosErrorFn,
  ResetErrorFn,
] => {
  const [error, setError] = useState<HttpErrorType | null>(null);
  const [axiosError, setAxiosError] = useState<AxiosError | null>(null);

  useEffect(() => {
    if (axiosError) {
      const httpError = AxiosErrorTypeFactory.produce(axiosError);

      setError(httpError);
    }
  }, [axiosError]);

  function reset() {
    setError(null);
  }

  return [error, setAxiosError, reset];
};
