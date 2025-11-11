'use client';

import React from 'react';

interface Props extends React.PropsWithChildren {}

const CreateSetLayout = ({ children }: Props) => {
  return (
      <div className="flex flex-col gap-4">{children}</div>
    );
};

export default CreateSetLayout; 