import React, { useState, useContext } from 'react';
import { GetServerSideProps } from 'next';
import Router from 'next/router';

import { useAxiosError } from '~/hooks';
import { ActionFailError } from '~/utils';
import { serverAxios, clientAxios } from '~/lib/axios';
import { Dto } from '~/interfaces';
import { GlobalContext } from '~/context';

import Head from '~/components/common/Head';
import PageTitle from '~/components/common/PageTitle';
import { ActionFailAlert } from '~/components/common/Error';
import NotFound from '~/components/common/NotFound';

interface Props {
  ticket: Dto.Ticket | null;
}

interface Query {
  ticketId: string;
  [key: string]: string;
}

const TicketDetail: React.FC<Props> = (props) => {
  const { ticket } = props;
  const user = useContext(GlobalContext).user;
  const [isSubmit, setIsSubmit] = useState(false);
  const [error, setError, reset] = useAxiosError();

  function onClickBtnPurchase() {
    if (!user) {
      return Router.push('/auth/signin');
    }

    if (!isSubmit) {
      setIsSubmit(true);
      reset();
      purchase(ticket!)
        .then((res) => {
          const order = res.data.data;

          Router.push('/orders/[orderId]', `/orders/${order.id}`);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setIsSubmit(false);
        });
    }
  }

  function purchase(ticket: Dto.Ticket) {
    return clientAxios.post<Dto.CreateOrderRes>('/api/order', {
      ticketId: ticket.id,
    });
  }

  if (!ticket) {
    return <NotFound />;
  }

  return (
    <>
      <Head title={`Ticket: ${ticket.title}`} />
      <div className="container mt-4">
        <PageTitle value={`Ticket: ${ticket.title}`} />

        <p>
          Price: <strong>${ticket.price}</strong>
        </p>

        {error instanceof ActionFailError && <ActionFailAlert error={error} />}

        <button
          className="btn btn-primary"
          onClick={() => onClickBtnPurchase()}
        >
          Purchase
        </button>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<any, Query> = async (
  ctx,
) => {
  const { params } = ctx;
  let ticketDetail: Dto.Ticket | null = null;

  try {
    const ticketDetailRes = await serverAxios.get<Dto.TicketDetailRes>(
      `/api/ticket/${params?.ticketId}`,
    );

    ticketDetail = ticketDetailRes.data.data;
  } catch (err) {
    if (err.response.status === 404) {
      ticketDetail = null;
    }
  }

  return {
    props: {
      ticket: ticketDetail,
    },
  };
};

export default TicketDetail;
