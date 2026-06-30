'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'square'
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', shape = 'circle', ...props }, ref) => {
    const sizeClasses = {
      xs: 'w-6 h-6 text-label-sm',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-16 h-16 text-headline-sm',
      xl: 'w-24 h-24 text-headline-lg',
    }

    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-lg',
    }

    const [imageError, setImageError] = React.useState(false)

    const initials = React.useMemo(() => {
      if (!fallback) return '?'
      return fallback
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }, [fallback])

    if (src && !imageError) {
      return (
        <div
          ref={ref}
          className={cn('inline-flex items-center justify-center bg-surface-variant text-on-surface-variant font-label-md overflow-hidden', sizeClasses[size], shapeClasses[shape], className)}
          {...props}
        >
          <img
            src={src}
            alt={alt || fallback || 'Avatar'}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center justify-center bg-surface-variant text-on-surface-variant font-label-md overflow-hidden', sizeClasses[size], shapeClasses[shape], className)}
        {...props}
      >
        {initials}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'