import React from 'react';
import { AppProps, AppContext } from 'next/app';
import { serverAxios } from '~/lib/axios';

import '~/assets/index.scss';
import { Dto, Domain } from '~/interfaces';

interface MyAppProps {
  user: Domain.CurrentUser | null;
}

const MyApp = (appProps: AppProps & MyAppProps): JSX.Element => {
  const { Component, pageProps } = appProps;

  return <Component {...pageProps} />;
};

MyApp.getInitialProps = async ({
  ctx,
  Component,
}: AppContext): Promise<MyAppProps> => {
  const headers = ctx.req?.headers;
  let myAppProps: MyAppProps = {
    user: null,
  };

  try {
    const res = await serverAxios.get<Dto.CurrentUserRes>(
      '/api/auth/current-user',
      { headers },
    );

    myAppProps = {
      ...myAppProps,
      user: res.data.data,
    };
  } catch (err) {
    myAppProps = { ...myAppProps };
  }

  if (Component.getInitialProps) {
    await Component.getInitialProps(ctx);
  }

  return myAppProps;
};

export default MyApp;
