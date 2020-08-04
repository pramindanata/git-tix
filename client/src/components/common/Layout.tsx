import React from 'react';

const Layout: React.FC = (props) => {
  return (
    <div>
      <nav>
        <h1>Header Here</h1>
      </nav>
      <main>{props.children}</main>
    </div>
  );
};

export default Layout;
