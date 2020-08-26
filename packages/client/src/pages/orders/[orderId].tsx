import React, { useState, useEffect } from 'react';
import { serverAxios, clientAxios } from '~/lib/axios';
import { Dto } from '~/interfaces';
import { GetServerSideProps } from 'next';

import { getReadableTime } from '~/utils/time';
import { useAxiosError } from '~/hooks';
import { ActionFailError } from '~/utils';
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
  const { order } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError, reset] = useAxiosError();

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

  // function onClickBtnPurchase() {
  //   if (!isSubmit) {
  //     setIsSubmit(true);
  //     reset();
  //     purchase(order!)
  //       .then((res) => {
  //         console.log(res.data.data);
  //       })
  //       .catch((err) => {
  //         setError(err);
  //       })
  //       .finally(() => {
  //         setIsSubmit(false);
  //       });
  //   }
  // }

  // function purchase(order: Dto.Order) {
  //   return clientAxios.post<Dto.CreateOrderRes>('/api/order', {
  //     orderId: order.id,
  //   });
  // }

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

        {timeLeft <= 0 ? (
          <div>
            <p className="text-danger">Order expired</p>
          </div>
        ) : (
          <div>
            <p>
              Time left to pay until order expires:{' '}
              <strong>{getReadableTime(timeLeft)}</strong>
            </p>
            {error instanceof ActionFailError && (
              <ActionFailAlert error={error} />
            )}
            <button
              className="btn btn-primary"
              // onClick={() => onClickBtnPurchase()}
            >
              Pay
            </button>
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
