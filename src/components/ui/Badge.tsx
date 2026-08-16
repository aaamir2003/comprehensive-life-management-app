import { cn } from '../../utils/cn';
import type { Priority } from '../../types';
import { PRIORITY_CONFIG } from '../../utils/helpers';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        {
          'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300': variant === 'default',
          'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400': variant === 'success',
          'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400': variant === 'warning',
          'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400': variant === 'danger',
          'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400': variant === 'info',
        },
        {
          'text-[10px] px-1.5 py-0.5': size === 'sm',
          'text-xs px-2 py-0.5': size === 'md',
        },
        className
      )}
    >
      {children}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: Priority;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, showLabel = true, size = 'sm' }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        {
          'text-[10px] px-1.5 py-0.5': size === 'sm',
          'text-xs px-2 py-1': size === 'md',
        }
      )}
      style={{ backgroundColor: `${config.color}15`, color: config.color }}
    >
      <span className="text-[8px]">{config.icon}</span>
      {showLabel && config.label}
    </span>
  );
}

interface StatusBadgeProps {
  completed: boolean;
  size?: 'sm' | 'md';
}

export function StatusBadge({ completed, size = 'sm' }: StatusBadgeProps) {
  return (
    <Badge variant={completed ? 'success' : 'default'} size={size}>
      {completed ? 'Done' : 'Pending'}
    </Badge>
  );
}
