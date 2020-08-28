import React, { useEffect } from 'react';
import Head from '~/components/common/Head';
import { clientAxios } from '~/lib/axios';
import { AuthService } from '~/utils';

const Signout: React.FC = () => {
  useEffect(() => {
    logout();
  }, []);

  async function logout() {
    await clientAxios.post('/api/auth/signout');

    AuthService.disableStatus();
    window.location.href = '/';
  }

  return (
    <>
      <Head title="Signin you out..." />
      <div className="container mt-4">
        <div>Signing you out...</div>
      </div>
    </>
  );
};

export default Signout;
