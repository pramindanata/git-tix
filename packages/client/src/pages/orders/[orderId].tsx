import React, { useState, useEffect, useContext } from 'react';
import { GetServerSideProps } from 'next';
import StripeCheckout, { Token } from 'react-stripe-checkout';

import { getReadableTime } from '~/utils/time';
import { useAxiosError } from '~/hooks';
import { ActionFailError } from '~/utils';
import { serverAxios, clientAxios } from '~/lib/axios';
import { GlobalContext } from '~/context';
import type { Dto } from '~/interfaces';

import Head from '~/components/common/Head';
import PageTitle from '~/components/common/PageTitle';
import { ActionFailAlert } from '~/components/common/Error';
import NotFound from '~/components/common/NotFound';

interface Props {
  order: Dto.Order | null;
}

interface Query {
  orderId: string;
  [key: string]: string;
}

const OrderDetail: React.FC<Props> = (props) => {
  const { order: orderProps } = props;
  const user = useContext(GlobalContext).user;
  const [order, setOrder] = useState(orderProps);
  const [isSubmit, setIsSubmit] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError, reset] = useAxiosError();
  const stripePubKey = process.env.NEXT_PUBLIC_STRIPE_PUB_KEY;

  useEffect(() => {
    const msPerSec = 1000;
    const expiredAt = new Date(order!.expiredAt).getTime();

    function getSecondLeft() {
      const currentTime = new Date().getTime();
      const timeLeft = expiredAt - currentTime;

      if (timeLeft <= 0) {
        return 0;
      }

      return timeLeft;
    }

    setTimeLeft(getSecondLeft());

    const timerId = setInterval(() => {
      setTimeLeft(getSecondLeft());
    }, msPerSec);

    return () => clearInterval(timerId);
  }, []);

  function onStripeTokenReceived(token: Token) {
    if (!isSubmit) {
      setIsSubmit(true);
      reset();
      purchase(order!, token)
        .then(() => {
          setOrder({
            ...order!,
            status: 'COMPLETE',
          });
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setIsSubmit(false);
        });
    }
  }

  function purchase(order: Dto.Order, token: Token) {
    return clientAxios.post<Dto.CreateOrderRes>('/api/payment', {
      orderId: order.id,
      token: token.id,
    });
  }

  function isOrderComplete() {
    return order?.status === 'COMPLETE';
  }

  function isOrderExpired() {
    return timeLeft <= 0 && !isOrderComplete();
  }

  if (!order) {
    return <NotFound />;
  }

  return (
    <>
      <Head title={`Order: #${order.id}`} />
      <div className="container mt-4">
        <PageTitle value={`Order: #${order.id}`} />

        <div>
          <div>
            Ticket: <strong>{order.ticket.title}</strong>
          </div>
          <div>
            Amount: <strong>${order.ticket.price}</strong>
          </div>
          <div>
            Ordered at:{' '}
            <strong>{new Date(order.createdAt).toDateString()}</strong>
          </div>
        </div>

        {isOrderComplete() && (
          <div>
            <p className="text-success">
              <strong>Order has been paid</strong>
            </p>
          </div>
        )}

        {isOrderExpired() && (
          <div>
            <p className="text-danger">
              <strong>Order expired</strong>
            </p>
          </div>
        )}

        {!isOrderComplete() && !isOrderExpired() && (
          <div>
            <p>
              Time left to pay until order expires:{' '}
              <strong>{getReadableTime(timeLeft)}</strong>
            </p>
            {error instanceof ActionFailError && (
              <ActionFailAlert error={error} />
            )}
            <StripeCheckout
              token={onStripeTokenReceived}
              stripeKey={stripePubKey!}
              amount={order.ticket.price * 100}
              email={user?.email}
            >
              <button className="btn btn-primary" disabled={isSubmit}>
                Pay with card
              </button>
            </StripeCheckout>
          </div>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<any, Query> = async (
  ctx,
) => {
  const { params, req } = ctx;
  const headers = req.headers;
  let orderDetail: Dto.Order | null = null;

  try {
    const orderDetailRes = await serverAxios.get<Dto.OrderDetailRes>(
      `/api/order/${params?.orderId}`,
      { headers },
    );

    orderDetail = orderDetailRes.data.data;
  } catch (err) {
    if (err.response.status === 404) {
      orderDetail = null;
    } else {
      throw err;
    }
  }

  return {
    props: {
      order: orderDetail,
    },
  };
};

export default OrderDetail;
