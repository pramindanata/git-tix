import React, { useEffect } from 'react';
import Router from 'next/router';
import { clientAxios } from '~/lib/axios';
import { AuthService } from '~/utils';

const Signout: React.FC = () => {
  useEffect(() => {
    logout();
  }, []);

  async function logout() {
    await clientAxios.post('/api/auth/signout');

    AuthService.disableStatus();
    Router.push('/');
  }

  return <div>Signing you out...</div>;
};

export default Signout;
