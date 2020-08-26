import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { serverAxios } from '~/lib/axios';
import { Dto } from '~/interfaces';

import Head from '~/components/common/Head';
import PageTitle from '~/components/common/PageTitle';

interface Props {
  ticketList: Dto.Ticket[];
}

const TicketIndex: React.FC<Props> = (props) => {
  const { ticketList } = props;

  return (
    <>
      <Head title="Tickets" />

      <div className="container mt-4">
        <PageTitle value="Tickets" />

        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Link</th>
            </tr>
          </thead>

          <tbody>
            {ticketList.map((ticket) => {
              return (
                <tr key={ticket.id}>
                  <td>{ticket.title}</td>
                  <td>$ {ticket.price}</td>
                  <td>
                    <Link
                      href="/tickets/[ticketId]"
                      as={`/tickets/${ticket.id}`}
                    >
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

export const getServerSideProps: GetServerSideProps = async () => {
  const ticketListRes = await serverAxios.get<Dto.TicketListRes>('/api/ticket');
  const ticketList = ticketListRes.data.data;

  return {
    props: {
      ticketList,
    },
  };
};

export default TicketIndex;
