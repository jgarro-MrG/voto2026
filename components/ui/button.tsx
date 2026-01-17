import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-cr-blue-500 text-white hover:bg-cr-blue-600 focus-visible:ring-cr-blue-500 border border-cr-red-500 disabled:bg-gray-300 disabled:text-gray-500',
        secondary:
          'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400 disabled:bg-gray-100 disabled:text-gray-400',
        outline:
          'border-2 border-cr-blue-500 bg-transparent text-cr-blue-600 hover:bg-cr-blue-50 focus-visible:ring-cr-blue-400 disabled:border-gray-300 disabled:text-gray-400',
        ghost: 'hover:bg-cr-blue-50 text-cr-blue-600 focus-visible:ring-cr-blue-400 disabled:text-gray-400',
        link: 'text-cr-blue-600 underline-offset-4 hover:underline disabled:text-gray-400',
        destructive:
          'bg-cr-red-500 text-white hover:bg-cr-red-600 focus-visible:ring-cr-red-500 disabled:bg-gray-300 disabled:text-gray-500',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-12 rounded-md px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
