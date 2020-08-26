import React, { useContext } from 'react';
import { GlobalContext } from '~/context';

import Head from '~/components/common/Head';
import PageTitle from '~/components/common/PageTitle';

const Home: React.FC = () => {
  const user = useContext(GlobalContext).user;

  return (
    <>
      <Head title="Home" />
      <div className="container mt-4">
        <PageTitle
          value={user ? 'You are signed in' : 'You are NOT signed in'}
        />

        {user && <p>Hello {user.email}</p>}

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

export default Home;
