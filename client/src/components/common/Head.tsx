import React from 'react';
import NextHead from 'next/head';

interface Props {
  title: string;
}

const Head: React.FC<Props> = ({ title }) => {
  return (
    <NextHead>
      <title>{title || 'App'} - Git Tix</title>
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    </NextHead>
  );
};

export default Head;
