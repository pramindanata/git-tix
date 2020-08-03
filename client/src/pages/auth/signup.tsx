import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import Head from '~/components/common/Head';
import { Dto, HttpError } from '~/interface';
import {
  AxiosErrorHandler,
  RequestValidationError,
  ActionFailError,
  HttpErrorTypes,
} from '~/util';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const [
    formErrors,
    setFormErrors,
  ] = useState<HttpError.RequestValidationDetail | null>(null);
  const [
    actionFailError,
    setActionFailError,
  ] = useState<HttpError.ActionFailDetail | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSubmit) {
      setIsSubmit(true);
      resetErrors();
      postSignup(email, password)
        .then(() => {
          setEmail('');
          setPassword('');
        })
        .catch((err: AxiosError) => {
          const error = AxiosErrorHandler.composeDetail(err);
          specifyError(error);
        })
        .finally(() => {
          setIsSubmit(false);
        });
    }
  }

  function postSignup(email: string, password: string) {
    return axios.post<Dto.SignUpRes>('/api/auth/signup', {
      email,
      password,
    });
  }

  function resetErrors() {
    setFormErrors(null);
    setActionFailError(null);
  }

  function specifyError(error: HttpErrorTypes) {
    if (error instanceof ActionFailError) {
      setActionFailError(error.serialize());
    } else if (error instanceof RequestValidationError) {
      setFormErrors(error.serialize());
    }
  }

  return (
    <>
      <Head title="Sign Up" />
      <div className="container">
        <h1>Signup</h1>

        {formErrors && (
          <div className="alert alert-danger">
            <ul className="mb-0">
              {formErrors?.data.map((error) => (
                <li key={error.field}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}

        {actionFailError && (
          <div className="alert alert-danger">
            <div>{actionFailError.message}</div>
          </div>
        )}

        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-group">
            <label htmlFor="email-input">Email</label>
            <input
              id="email-input"
              type="email"
              required
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              type="password"
              required
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
};

export default Signup;
