import React from 'react';
import Head from '~/components/common/Head';

const Home: React.FC = () => {
  return (
    <>
      <Head title="Home" />
      <div className="container">
        <h1>Welcome to Nuxt.js</h1>
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
