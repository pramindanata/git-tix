import React from 'react';

interface Props {
  value: string;
}

const PageTitle: React.FC<Props> = (props) => {
  const { value } = props;

  return <h3 className="mb-4">{value}</h3>;
};

export default PageTitle;
