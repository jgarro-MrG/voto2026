'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Tooltip } from './tooltip'

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  orientation?: 'vertical' | 'horizontal'
  className?: string
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  orientation = 'vertical',
  className,
}: RadioGroupProps) {
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(value)

  React.useEffect(() => {
    setSelectedValue(value)
  }, [value])

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue)
    onChange?.(newValue)
  }

  return (
    <div
      className={cn(
        'space-y-3',
        orientation === 'horizontal' && 'flex flex-wrap gap-3 space-y-0',
        className
      )}
      role="radiogroup"
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'relative flex cursor-pointer items-start rounded-lg border-2 p-4 transition-all hover:bg-cr-blue-50',
            selectedValue === option.value
              ? 'border-cr-red-500 bg-cr-red-50 shadow-md'
              : 'border-cr-blue-200',
            orientation === 'horizontal' && 'flex-1 min-w-[200px]'
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={(e) => handleChange(e.target.value)}
            className="sr-only"
          />
          <div className="flex items-start w-full">
            <div
              className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                selectedValue === option.value
                  ? 'border-cr-red-500 bg-cr-red-500'
                  : 'border-cr-blue-300'
              )}
            >
              {selectedValue === option.value && (
                <div className="h-2 w-2 rounded-full bg-white" />
              )}
            </div>
            <div className="ml-3 flex-1 flex items-start justify-between gap-2">
              <span
                className={cn(
                  'block text-sm font-medium',
                  selectedValue === option.value
                    ? 'text-cr-red-700'
                    : 'text-gray-900'
                )}
              >
                {option.label}
              </span>
              {option.description && (
                <Tooltip content={option.description} />
              )}
            </div>
          </div>
        </label>
      ))}
    </div>
  )
}
