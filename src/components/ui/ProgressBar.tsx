import { cn } from '../../utils/cn';

interface ProgressBarProps {
  progress: number;
  color?: string;
  customColor?: string;
  className?: string;
  height?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  progress,
  color = 'bg-primary-500',
  customColor,
  className,
  height = 'h-2.5',
  showLabel,
  animated = true
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">{clampedProgress}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden', height)}>
        <div
          className={cn(
            'rounded-full',
            height,
            animated && 'transition-all duration-700 ease-out',
            !customColor && color
          )}
          style={{
            width: `${clampedProgress}%`,
            ...(customColor ? { backgroundColor: customColor } : {})
          }}
        />
      </div>
    </div>
  );
}

interface ProgressBarWithLabelProps extends ProgressBarProps {
  label: string;
  value: string;
}

export function ProgressBarWithLabel({ label, value, ...props }: ProgressBarWithLabelProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
        <span className="text-xs text-gray-400">{value}</span>
      </div>
      <ProgressBar {...props} />
    </div>
  );
}
