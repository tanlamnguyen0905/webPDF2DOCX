'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TableProps {
  columns: { key: string; header: string; className?: string }[]
  data: Record<string, unknown>[]
  keyField: string
  renderRow?: (row: Record<string, unknown>) => React.ReactNode
  emptyMessage?: string
  className?: string
}

export const Table = ({ columns, data, keyField, renderRow, emptyMessage = 'Không có dữ liệu', className }: TableProps) => {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-outline-variant', className)}>
      {data.length > 0 ? (
        <table className="w-full text-left text-body-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 font-label-md text-label-md text-on-surface-variant bg-surface-container-low border-b border-outline-variant',
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={String(row[keyField])}
                className="border-b border-outline-variant/50 hover:bg-surface-container-low/50"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn('px-4 py-3 text-on-surface', column.className)}
                  >
                    {renderRow ? (
                      renderRow(row)
                    ) : (
                      String(row[column.key] ?? '')
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="p-8 text-center text-on-surface-variant">
          {emptyMessage}
        </div>
      )}
    </div>
  )
}

export interface TablePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPageSize?: boolean
  pageSize?: number
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
}

export const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageSize = false,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: TablePaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-4 py-3 border-t border-outline-variant">
      <div className="font-body-sm text-body-sm text-on-surface-variant">
        Trang {currentPage} / {totalPages}
      </div>
      <div className="flex items-center gap-2">
        {showPageSize && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className="px-3 py-1.5 text-body-sm border border-outline-variant rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} / trang
              </option>
            ))}
          </select>
        )}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-body-sm border border-outline-variant rounded-lg bg-surface hover:bg-surface-variant disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Trước
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-body-sm border border-outline-variant rounded-lg bg-surface hover:bg-surface-variant disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Sau
        </button>
      </div>
    </div>
  )
}