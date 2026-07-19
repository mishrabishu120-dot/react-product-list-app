import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-surface-2 border-t-primary animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-xl">
          🛍
        </div>
      </div>
      <h2 className="mt-4 text-xl font-medium text-text-primary animate-pulse">Loading ShopFlow...</h2>
    </div>
  );
}
