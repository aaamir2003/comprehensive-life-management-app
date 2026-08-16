import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 gap-2',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        'active:scale-[0.97]',
        {
          'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm shadow-primary-500/20': variant === 'primary',
          'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-400': variant === 'secondary',
          'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-sm shadow-red-500/20': variant === 'danger',
          'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-400': variant === 'ghost',
          'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-400 shadow-sm shadow-accent-500/20': variant === 'success',
          'border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 focus:ring-primary-400': variant === 'outline',
        },
        {
          'text-[11px] px-2 py-1': size === 'xs',
          'text-xs px-2.5 py-1.5': size === 'sm',
          'text-sm px-4 py-2.5': size === 'md',
          'text-base px-6 py-3': size === 'lg',
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function IconButton({ variant = 'ghost', size = 'md', className, children, ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-95',
        {
          'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500': variant === 'primary',
          'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-400': variant === 'secondary',
          'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 focus:ring-red-400': variant === 'danger',
          'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 focus:ring-gray-400': variant === 'ghost',
        },
        {
          'p-1.5': size === 'sm',
          'p-2': size === 'md',
          'p-2.5': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
