import React, { useContext } from 'react';
import Head from '~/components/common/Head';
import { GlobalContext } from '~/context';

const Home: React.FC = () => {
  const user = useContext(GlobalContext).user;

  return (
    <>
      <Head title="Home" />
      <div className="container mt-4">
        <h1>{user ? 'You are signed in' : 'You are NOT signed in'}</h1>

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
