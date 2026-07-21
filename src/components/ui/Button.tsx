import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'text-primary-foreground border-0 bg-[image:linear-gradient(180deg,var(--brand-400),var(--brand-600))]',
  secondary:
    'text-secondary-foreground border border-border bg-[image:linear-gradient(180deg,color-mix(in_srgb,var(--secondary)_80%,#ffffff_20%),var(--secondary))]',
  success:
    'text-success-foreground border-0 bg-[image:linear-gradient(180deg,var(--state-success-dark),var(--state-success))]',
  ghost: 'bg-transparent text-foreground hover:bg-accent border border-transparent',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn-capsule shadow-md ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`.trim()}
      {...props}
    />
  );
}
