import React from 'react';
import { AppProps } from 'next/app';
import '~/assets/index.scss';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default App;
