import React from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
  animated?: boolean;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3b82f6',
  bgColor = '#e5e7eb',
  children,
  animated = true,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const offset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
          className="dark:opacity-30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={animated ? 'transition-all duration-700 ease-out' : ''}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

interface ProgressRingWithLabelProps extends ProgressRingProps {
  label: string;
  value: string;
}

export function ProgressRingWithLabel({ label, value, ...props }: ProgressRingWithLabelProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <ProgressRing {...props}>
        <div className="text-center">
          <p className="text-lg font-bold">{props.progress}%</p>
        </div>
      </ProgressRing>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
        <p className="text-xs text-gray-400">{value}</p>
      </div>
    </div>
  );
}
