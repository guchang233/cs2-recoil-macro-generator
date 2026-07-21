import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`glass text-card-foreground rounded-3xl ${className}`.trim()}
      {...props}
    />
  );
}
