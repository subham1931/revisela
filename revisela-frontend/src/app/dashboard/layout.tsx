import React from 'react';

interface Props extends React.PropsWithChildren {}

const Layout = ({ children }: Props) => {
  return (
    <div className="p-6 mt-17 min-h-screen">
      <div className="flex flex-col gap-4">
        {children}
        </div>
    </div>
  );
};

export default Layout;
