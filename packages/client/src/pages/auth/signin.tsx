import React, { useState } from 'react';
import Router from 'next/router';

import { Dto } from '~/interfaces';
import { useAxiosError } from '~/hooks';
import { clientAxios } from '~/lib/axios';
import { ActionFailError, RequestValidationError, AuthService } from '~/utils';

import {
  ActionFailAlert,
  RequestValidationAlert,
} from '~/components/common/Error';
import Head from '~/components/common/Head';
import PageTitle from '~/components/common/PageTitle';

const Signin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const [error, setAxiosError, reset] = useAxiosError();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSubmit) {
      setIsSubmit(true);
      reset();

      try {
        await postSignin(email, password);

        setEmail('');
        setPassword('');
        AuthService.enableStatus();
        Router.push('/');
      } catch (err) {
        setAxiosError(err);
        setIsSubmit(false);
      }
    }
  }

  function postSignin(email: string, password: string) {
    return clientAxios.post<Dto.SignUpRes>('/api/auth/signin', {
      email,
      password,
    });
  }

  return (
    <>
      <Head title="Sign In" />
      <div className="container mt-4">
        <PageTitle value="Sign In" />

        {error instanceof RequestValidationError && (
          <RequestValidationAlert error={error} />
        )}

        {error instanceof ActionFailError && <ActionFailAlert error={error} />}

        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-group">
            <label htmlFor="email-input">Email</label>
            <input
              id="email-input"
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

          <button className="btn btn-primary" type="submit" disabled={isSubmit}>
            {isSubmit ? 'Loading' : 'Sign In'}
          </button>
        </form>
      </div>
    </>
  );
};

export default Signin;
