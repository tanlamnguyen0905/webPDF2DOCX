'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, AlertCircle, AlertTriangle, X, Info } from 'lucide-react'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ id, type, title, message, duration = 5000, onClose, action, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)

    React.useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose(id), 300)
      }, duration)

      return () => clearTimeout(timer)
    }, [id, duration, onClose])

    if (!isVisible) return null

    const typeStyles = {
      success: 'border-success/30 bg-success/5',
      error: 'border-error/30 bg-error/5',
      warning: 'border-warning/30 bg-warning/5',
      info: 'border-primary/30 bg-primary/5',
    }

    const icons = {
      success: <CheckCircle className="w-5 h-5 text-success" />,
      error: <AlertCircle className="w-5 h-5 text-error" />,
      warning: <AlertTriangle className="w-5 h-5 text-warning" />,
      info: <Info className="w-5 h-5 text-primary" />,
    }

    return (
      <div
        ref={ref}
        className={cn(
          'fixed bottom-6 right-6 z-toast flex items-start gap-3 px-4 py-3 rounded-xl shadow-overlay border animate-slide-in max-w-sm',
          typeStyles[type]
        )}
        role="alert"
        aria-live="polite"
        {...props}
      >
        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
        <div className="flex-1 min-w-0">
          <p className="font-label-md text-label-md text-on-surface">{title}</p>
          {message && (
            <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">{message}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {action && (
            <button
              onClick={action.onClick}
              className="font-label-sm text-label-sm text-primary hover:underline"
            >
              {action.label}
            </button>
          )}
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => onClose(id), 300)
            }}
            className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }
)

Toast.displayName = 'Toast'

export interface ToastContainerProps {
  toasts: ToastProps[]
  onClose: (id: string) => void
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-toast flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} className="pointer-events-auto" />
      ))}
    </div>
  )
}