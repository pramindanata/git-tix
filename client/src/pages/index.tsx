import React from 'react';
import { GetServerSideProps } from 'next';
import Head from '~/components/common/Head';
import { serverAxios } from '~/lib';
import { Dto, Domain } from '~/interfaces';

interface Props {
  user: Domain.CurrentUser | null;
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
  const { headers } = ctx.req;
  const initialProps: Props = {
    user: null,
  };

  try {
    const res = await serverAxios.get<Dto.CurrentUserRes>(
      'api/auth/current-user',
      { headers },
    );

    return {
      props: {
        ...initialProps,
        user: res.data.data,
      },
    };
  } catch (err) {
    return {
      props: initialProps,
    };
  }
};

export default Home;
