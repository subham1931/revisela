import React from 'react';

import { ContentLoader } from '@/components/ui/loaders';

export default function AuthLoading() {
  return (
    <div className="h-screen">
      <ContentLoader
        message="Loading authentication..."
        size="lg"
        variant="primary"
        className="h-full"
      />
    </div>
  );
}
