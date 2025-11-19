import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  glassStrong?: boolean;
}

/**
 * Card Component
 * Container with glass morphism effect
 */
export function Card({ children, glass = false, glassStrong = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg p-6',
        {
          glass: glass,
          'glass-strong': glassStrong,
          'bg-card text-card-foreground': !glass && !glassStrong,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
