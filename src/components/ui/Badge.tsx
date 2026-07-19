import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  const text = typeof children === 'string' ? children : '';
  
  const getBadgeColor = (t: string) => {
    const l = t.toLowerCase();
    if (l.includes('best seller') || l.includes('bestseller')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (l.includes('new')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (l.includes('sale') || l.includes('top pick')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    if (l.includes('eco')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
    if (l.includes('handmade')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    if (l.includes('gift idea')) return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
    
    return 'bg-primary/10 text-primary';
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', getBadgeColor(text), className)}>
      {children}
    </span>
  );
}

export default Badge;

