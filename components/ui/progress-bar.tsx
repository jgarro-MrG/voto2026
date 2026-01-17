import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number // 0-100
  max?: number
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = false,
  size = 'md',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Progreso</span>
          <span className="text-gray-500">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-gray-200 border border-cr-blue-200',
          sizeClasses[size]
        )}
      >
        <div
          className="h-full bg-gradient-to-r from-cr-blue-500 to-cr-red-500 transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}
