import React from 'react';
import { AppProps, AppContext } from 'next/app';
import { serverAxios } from '~/lib/axios';

import '~/assets/index.scss';
import { AxiosRequestConfig } from 'axios';
import { GlobalContext } from '~/context';
import { Dto, Domain, Context } from '~/interfaces';
import Navbar from '~/components/common/Navbar';

interface MyAppProps {
  pageProps: any;
  user: Domain.CurrentUser | null;
}

const MyApp = (appProps: AppProps & MyAppProps): JSX.Element => {
  const { Component, pageProps, user } = appProps;
  const contextValue: Context.Global = {
    user,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      <nav>
        <Navbar />
      </nav>
      <main>
        <Component {...pageProps} />
      </main>
    </GlobalContext.Provider>
  );
};

MyApp.getInitialProps = async ({
  ctx,
  Component,
}: AppContext): Promise<MyAppProps> => {
  const headers = ctx.req?.headers;
  let pageProps = {};
  let user: Domain.CurrentUser | null = null;

  try {
    const currentUserResDto = await getCurrentUser(headers);

    user = currentUserResDto.data;
  } catch (err) {
    user = null;
  }

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return {
    pageProps,
    user,
  };
};

async function getCurrentUser(
  headers: AxiosRequestConfig['headers'],
): Promise<Dto.CurrentUserRes> {
  const res = await serverAxios.get<Dto.CurrentUserRes>(
    '/api/auth/current-user',
    { headers },
  );

  return res.data;
}

export default MyApp;
