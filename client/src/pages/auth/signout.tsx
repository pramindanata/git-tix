import React, { useEffect } from 'react';
import Router from 'next/router';
import { clientAxios } from '~/lib/axios';

const Signout: React.FC = () => {
  useEffect(() => {
    logout();
  }, []);

  async function logout() {
    await clientAxios.post('/api/auth/signout');

    Router.push('/');
  }

  return <div>Signing you out...</div>;
};

export default Signout;
