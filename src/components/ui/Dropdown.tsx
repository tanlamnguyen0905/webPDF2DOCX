'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'

export interface DropdownItem {
  label: string
  onClick: () => void
  icon?: React.ReactNode
  disabled?: boolean
  danger?: boolean
  divider?: boolean
}

export interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  offset?: number
}

export const Dropdown = ({ trigger, items, align = 'right', offset = 8 }: DropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled && !item.divider) {
      item.onClick()
      setIsOpen(false)
    }
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 w-56 bg-surface border border-outline-variant rounded-lg shadow-overlay animate-scale-in',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          role="menu"
        >
          <div className="py-1">
            {items.map((item, index) => (
              <React.Fragment key={index}>
                {item.divider && <hr className="my-1 border-outline-variant" />}
                {!item.divider && (
                  <button
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    className={cn(
                      'w-full px-3 py-2 text-left font-body-md text-body-md transition-colors',
                      item.danger
                        ? 'text-error hover:bg-error/5'
                        : 'text-on-surface hover:bg-surface-variant',
                      item.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    role="menuitem"
                    aria-disabled={item.disabled}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                      {item.label}
                    </div>
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}