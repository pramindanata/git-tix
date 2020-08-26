import React from 'react';

import Head from './Head';
import PageTitle from './PageTitle';

const NotFound: React.FC = () => {
  return (
    <>
      <Head title="Not Found" />
      <div className="container mt-4">
        <PageTitle value="Whoops..." />
        <p className="text-danger">Data not found</p>
      </div>
    </>
  );
};

export default NotFound;
