import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-bold text-primary mb-4 animate-fade-in-up">404</div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">Page not found</h2>
      <p className="text-text-secondary mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <Link href="/">
        <Button variant="primary">Back to Home</Button>
      </Link>
    </div>
  );
}
