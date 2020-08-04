import React from 'react';
import { GetServerSideProps } from 'next';
import Head from '~/components/common/Head';
import { serverAxios } from '~/lib/axios';
import { Dto, Domain } from '~/interfaces';

interface Props {
  user: Domain.CurrentUser | null;
  xx: number;
}

const Home: React.FC<Props> = (props) => {
  const { user } = props;

  return (
    <>
      <Head title="Home" />
      <div className="container">
        <h1>{user ? 'You are signed in' : 'You are NOT signed in'}</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Inx esse
          consectetur quod, iure quia aperiam rerum veniam dignissimos itaque
          magni. Suscipit, exercitationem dolor reprehenderit delectus saepe
          sapiente neque voluptas commodi!
        </p>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      xx: 123,
    },
  };
};

export default Home;
