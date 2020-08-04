import React, { useState } from 'react';
import Router from 'next/router';
import Head from '~/components/common/Head';
import { Dto } from '~/interfaces';
import { useAxiosError } from '~/hooks';
import { clientAxios } from '~/lib/axios';

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
      <Head title="Sign Up" />
      <div className="container">
        <h1>Signin</h1>

        {error.requestValidation && (
          <div className="alert alert-danger">
            <ul className="mb-0">
              {error.requestValidation.serialize().map((error) => (
                <li key={error.field}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}

        {error.actionFail && (
          <div className="alert alert-danger">
            <div>{error.actionFail.serialize().message}</div>
          </div>
        )}

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
            {isSubmit ? 'Loading' : 'Sign Up'}
          </button>
        </form>
      </div>
    </>
  );
};

export default Signin;
