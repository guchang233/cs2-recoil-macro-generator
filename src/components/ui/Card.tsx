import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`glass glass-inset text-card-foreground border border-border rounded-3xl ${className}`.trim()}
      {...props}
    />
  );
}
