'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  onRemove?: () => void
  removable?: boolean
}

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, variant = 'neutral', size = 'md', icon, onRemove, removable = false, children, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-primary/10 text-primary',
      success: 'bg-success/10 text-success',
      warning: 'bg-warning/10 text-warning',
      error: 'bg-error/10 text-error',
      neutral: 'bg-surface-variant text-on-surface-variant',
    }

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-label-sm gap-1',
      md: 'px-3 py-1 text-label-sm gap-1.5',
      lg: 'px-4 py-1.5 text-label-md gap-2',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-label-sm rounded-full',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {removable && onRemove && (
          <button
            onClick={onRemove}
            className={cn(
              'flex-shrink-0 rounded-full transition-colors',
              size === 'sm' && 'w-4 h-4',
              size === 'md' && 'w-5 h-5',
              size === 'lg' && 'w-6 h-6'
            )}
            aria-label="Xóa"
          >
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </span>
    )
  }
)

Chip.displayName = 'Chip'