'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-4">🚨</div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">Something went wrong!</h2>
      <p className="text-text-secondary mb-6 max-w-md">
        An unexpected error occurred while loading this page. We've been notified and are looking into it.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="primary">Try again</Button>
        <Button onClick={() => window.location.href = '/'} variant="secondary">Go Home</Button>
      </div>
    </div>
  );
}
