import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { serverAxios } from '~/lib/axios';
import { Dto } from '~/interfaces';

import Head from '~/components/common/Head';
import PageTitle from '~/components/common/PageTitle';

interface Props {
  orderList: Dto.Order[];
}

function getOrderStatusColor(status: string) {
  if (status === 'CREATED') {
    return 'primary';
  } else if (status === 'COMPLETE') {
    return 'success';
  }

  return 'danger';
}

const OrderIndex: React.FC<Props> = (props) => {
  const { orderList } = props;

  return (
    <>
      <Head title="My Order" />

      <div className="container mt-4">
        <PageTitle value="My Order" />

        <table className="table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Link</th>
            </tr>
          </thead>

          <tbody>
            {orderList.map((order) => {
              return (
                <tr key={order.id}>
                  <td>{order.ticket.title}</td>
                  <td>$ {order.ticket.price}</td>
                  <td>
                    <strong
                      className={`text-${getOrderStatusColor(order.status)}`}
                    >
                      {order.status}
                    </strong>
                  </td>
                  <td>
                    <Link href="/orders/[orderId]" as={`/orders/${order.id}`}>
                      <a>View</a>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { headers } = ctx.req;
  const orderListRes = await serverAxios.get<Dto.OrderListRes>('/api/order', {
    headers,
  });
  const orderList = orderListRes.data.data;

  return {
    props: {
      orderList,
    },
  };
};

export default OrderIndex;
