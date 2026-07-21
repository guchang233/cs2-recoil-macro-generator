import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-card text-card-foreground border border-border rounded-2xl shadow-sm ${className}`.trim()}
      {...props}
    />
  );
}
