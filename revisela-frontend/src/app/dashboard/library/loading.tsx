import React from 'react';

import { ContentLoader } from '@/components/ui/loaders';

export default function LibraryLoading() {
  return (
    <div className="p-6 ml-64 h-screen">
      <ContentLoader
        message="Loading your library..."
        size="lg"
        variant="primary"
        className="h-full"
      />
    </div>
  );
}
