import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-surface-2", className)} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 border border-border rounded-xl bg-surface">
      <Skeleton className="w-full aspect-square rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex justify-between items-center mt-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

export default Skeleton;

