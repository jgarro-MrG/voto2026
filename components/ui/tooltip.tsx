'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: string
  className?: string
}

export function Tooltip({ content, className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className={cn(
          'inline-flex items-center justify-center w-5 h-5 rounded-full',
          'text-cr-blue-500 hover:text-cr-blue-700 hover:bg-cr-blue-50',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-cr-blue-400',
          className
        )}
        onClick={() => setIsVisible(!isVisible)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        aria-label="Más información"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isVisible && (
        <div
          className={cn(
            'absolute z-50 w-64 p-3 text-sm',
            'bg-white border-2 border-cr-blue-200 rounded-lg shadow-lg',
            'bottom-full left-1/2 -translate-x-1/2 mb-2',
            'before:content-[""] before:absolute before:top-full before:left-1/2',
            'before:-translate-x-1/2 before:border-8 before:border-transparent',
            'before:border-t-cr-blue-200'
          )}
          role="tooltip"
        >
          <p className="text-gray-700 leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  )
}
