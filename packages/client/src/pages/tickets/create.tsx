import React, { useState } from 'react';
import Router from 'next/router';
import { clientAxios } from '~/lib/axios';
import { useAxiosError } from '~/hooks';
import { RequestValidationError, ActionFailError } from '~/utils';
import type { Dto } from '~/interfaces';

import Head from '~/components/common/Head';
import PageTitle from '~/components/common/PageTitle';
import {
  ActionFailAlert,
  RequestValidationAlert,
} from '~/components/common/Error';

const TicketCreate: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [error, setError, reset] = useAxiosError();

  function onPriceInputBlur() {
    const validPrice = parseFloat(price);

    if (isNaN(validPrice)) {
      return;
    }

    setPrice(validPrice.toFixed(2).toString());
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isSubmit) {
      setIsSubmit(true);
      reset();
      createPost(title, parseFloat(price))
        .then(() => {
          setTitle('');
          setPrice('');

          Router.push('/');
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setIsSubmit(false);
        });
    }
  }

  function createPost(title: string, price: number) {
    return clientAxios.post<Dto.CreateTicketRes>('/api/ticket', {
      title,
      price,
    });
  }

  return (
    <>
      <Head title="Create Ticket" />

      <div className="container mt-4">
        <PageTitle value="Create Ticket" />

        {error instanceof RequestValidationError && (
          <RequestValidationAlert error={error} />
        )}

        {error instanceof ActionFailError && <ActionFailAlert error={error} />}

        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-group">
            <label htmlFor="title-input">Title</label>
            <input
              id="title-input"
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="title-input">Price ($)</label>
            <input
              id="title-input"
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onBlur={() => onPriceInputBlur()}
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default TicketCreate;
