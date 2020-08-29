import React, { useContext } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { serverAxios } from '~/lib/axios';
import { GlobalContext } from '~/context';
import { Dto } from '~/interfaces';

import Head from '~/components/common/Head';
import PageTitle from '~/components/common/PageTitle';

interface Props {
  ticketList: Dto.Ticket[];
}

const Home: React.FC<Props> = (props) => {
  const { ticketList } = props;
  const user = useContext(GlobalContext).user;

  return (
    <>
      <Head title="Home" />

      <div className="container mt-4">
        <PageTitle value="Tickets" />

        {user && <p>Hello {user.email}</p>}

        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Link</th>
            </tr>
          </thead>

          <tbody>
            {ticketList.length > 0 ? (
              ticketList.map((ticket) => {
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
              })
            ) : (
              <tr>
                <td className="text-center" colSpan={3}>
                  No ticket available right now
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  console.log(headers);
  const { headers } = ctx.req;
  const ticketListRes = await serverAxios.get<Dto.TicketListRes>(
    '/api/ticket',
    { headers },
  );
  const ticketList = ticketListRes.data.data;

  return {
    props: {
      ticketList,
    },
  };
};

export default Home;
