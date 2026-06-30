'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
  className?: string
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ className, isOpen, onClose, title, description, children, size = 'md', closeOnOverlayClick = true, showCloseButton = true, ...props }, ref) => {
    if (!isOpen) return null

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-[90vw]',
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose()
      }
    }

    return (
      <div
        className="fixed inset-0 z-modal bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleOverlayClick}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        <div
          ref={ref}
          className={cn(
            'fixed left-1/2 top-1/2 z-[101] -translate-x-1/2 -translate-y-1/2 w-full bg-surface rounded-2xl shadow-overlay border border-outline-variant animate-scale-in',
            sizeClasses[size],
            className
          )}
          {...props}
        >
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-6 border-b border-outline-variant">
              <div>
                {title && (
                  <h2 id="modal-title" className="font-headline-md text-headline-md text-on-surface">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id="modal-description" className="mt-1 font-body-md text-body-md text-on-surface-variant">
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    )
  }
)

Modal.displayName = 'Modal'