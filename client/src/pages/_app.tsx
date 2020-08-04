import React from 'react';
import { AppProps, AppContext } from 'next/app';

import '~/assets/index.scss';
import { AxiosRequestConfig } from 'axios';
import { GlobalContext } from '~/context';
import { Dto, Domain, Context } from '~/interfaces';
import Navbar from '~/components/common/Navbar';
import { getHttpClient } from '~/lib/axios';
import { AuthService, EnvService } from '~/utils';

interface MyAppProps {
  pageProps: any;
  user: Domain.CurrentUser | null;
}

let userStore: Domain.CurrentUser | null = null;

const MyApp = (appProps: AppProps & MyAppProps): JSX.Element => {
  const { Component, pageProps, user } = appProps;
  const contextValue: Context.Global = {
    user: userStore || user,
  };

  if (user && EnvService.isInClient()) {
    userStore = user;
    // Make sure auth is active on each navigation if user data exist.
    AuthService.enableStatus();
  }

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
  const isInServer = EnvService.isInServer();
  let pageProps = {};
  let user: Domain.CurrentUser | null = null;

  if (!isInServer) {
    resetUserStoreIfAuthStatusEmpty();
  }

  try {
    const currentUserResDto = await getCurrentUserByEnv(isInServer, headers);

    user = currentUserResDto?.data || null;
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
  const httpClient = getHttpClient();
  const getCurrentUserUrl = '/api/auth/current-user';

  const res = await httpClient.get<Dto.CurrentUserRes>(getCurrentUserUrl, {
    headers,
  });

  return res.data;
}

function resetUserStoreIfAuthStatusEmpty(): void {
  const isSignin = AuthService.getStatus();

  if (!isSignin) {
    userStore = null;
  }
}

async function getCurrentUserByEnv(
  isInServer: boolean,
  reqHeaders: any,
): Promise<Dto.CurrentUserRes | null> {
  let res: Dto.CurrentUserRes | null = null;

  if (isInServer) {
    res = await getCurrentUser(reqHeaders);
  } else {
    const isSignin = AuthService.getStatus();

    if (isSignin && !userStore) {
      res = await getCurrentUser(reqHeaders);
    }
  }

  return res;
}

export default MyApp;
