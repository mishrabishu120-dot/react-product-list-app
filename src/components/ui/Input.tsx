import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col space-y-1">
        {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-lg border bg-surface px-4 py-2 text-text-primary transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
              icon ? "pl-10" : "",
              error 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                : "border-border focus:border-primary focus:ring-primary/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

