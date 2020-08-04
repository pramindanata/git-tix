import React from 'react';
import { AppProps, AppContext } from 'next/app';
import { serverAxios } from '~/lib/axios';

import '~/assets/index.scss';
import { Dto, Domain } from '~/interfaces';
import { AxiosRequestConfig } from 'axios';

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
    const currentUserResDto = await getCurrentUser(headers);

    myAppProps = {
      ...myAppProps,
      user: currentUserResDto.data,
    };
  } catch (err) {
    myAppProps = { ...myAppProps };
  }

  if (Component.getInitialProps) {
    await Component.getInitialProps(ctx);
  }

  return myAppProps;
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
