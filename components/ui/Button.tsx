import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

/**
 * Button Component
 * Reusable button with variants and styles
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  glow = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-semibold rounded-lg transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-primary text-primary-foreground hover:opacity-90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:opacity-90': variant === 'secondary',
          'bg-transparent border border-border hover:bg-accent': variant === 'ghost',
          'px-4 py-2 text-sm': size === 'sm',
          'px-6 py-3 text-base': size === 'md',
          'px-8 py-4 text-lg': size === 'lg',
          'glow-primary': glow && variant === 'primary',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
