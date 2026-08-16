import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  printCard?: boolean;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, printCard, hover, gradient, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-5',
        'transition-all duration-200',
        hover && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]',
        gradient && 'bg-gradient-to-br',
        printCard && 'print-card print-avoid-break',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div className="flex items-center gap-2">{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function CardTitle({ children, className, icon }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2', className)}>
      {icon}
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-gray-500 dark:text-gray-400 mt-1', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50', className)}>
      {children}
    </div>
  );
}
