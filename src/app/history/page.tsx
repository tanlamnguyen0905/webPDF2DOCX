'use client'

import * as React from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { Button, Badge, Table, TablePagination } from '@/components/ui'
import { Download, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusLabels: Record<string, { label: string; variant: 'success' | 'error' | 'warning' | 'neutral' }> = {
  success: { label: 'Thành công', variant: 'success' },
  failed: { label: 'Thất bại', variant: 'error' },
  processing: { label: 'Đang xử lý', variant: 'warning' },
}

const mockData = [
  { id: '1', pdfName: 'document.pdf', docxName: 'document.docx', date: '22/06/2026 10:30', status: 'success', mode: 'premium', coin: '-15', downloadable: true },
  { id: '2', pdfName: 'report_q2.pdf', docxName: 'report_q2.docx', date: '21/06/2026 15:22', status: 'success', mode: 'free', coin: '0', downloadable: true },
  { id: '3', pdfName: 'contract_v2.pdf', docxName: 'contract_v2.docx', date: '20/06/2026 09:15', status: 'failed', mode: 'free', coin: '0', downloadable: false },
  { id: '4', pdfName: 'invoice_may.pdf', docxName: 'invoice_may.docx', date: '19/06/2026 14:00', status: 'processing', mode: 'premium', coin: '-12', downloadable: false },
  { id: '5', pdfName: 'presentation.pdf', docxName: 'presentation.docx', date: '18/06/2026 11:45', status: 'success', mode: 'free', coin: '0', downloadable: true },
]

export default function HistoryPage() {
  const [statusFilter, setStatusFilter] = React.useState('all')

  const filteredData = mockData.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false
    return true
  })

  const columns = [
    { key: 'pdfName', header: 'File PDF' },
    { key: 'arrow', header: '' },
    { key: 'docxName', header: 'File DOCX' },
    { key: 'date', header: 'Ngày giờ' },
    { key: 'status', header: 'Trạng thái' },
    { key: 'coin', header: 'Coin' },
    { key: 'actions', header: 'Hành động' },
  ]

  const data = filteredData.map((item) => ({
    ...item,
    arrow: '→',
    status: (
      <Badge variant={statusLabels[item.status]?.variant || 'neutral'}>
        {statusLabels[item.status]?.label}
      </Badge>
    ),
    actions: item.downloadable ? (
      <button className="btn-ghost btn-sm">
        <Download className="w-4 h-4" />
      </button>
    ) : (
      <span className="text-body-sm text-on-surface-variant">—</span>
    ),
  }))

  return (
    <MainLayout>
      <div className="container-main page-section">
        <div className="max-w-[960px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-body-sm text-on-surface-variant mb-lg">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-on-surface">Lịch sử</span>
          </div>

          <h1 className="text-headline-lg font-headline-lg text-on-surface mb-lg">Lịch sử chuyển đổi</h1>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-lg">
            <div className="flex items-center gap-2 bg-surface border border-outline-variant rounded-lg px-3 py-2">
              <Filter className="w-4 h-4 text-on-surface-variant" />
              <span className="text-label-sm text-on-surface-variant">Trạng thái:</span>
            </div>
            {['all', 'success', 'failed', 'processing'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-label-sm transition-colors',
                  statusFilter === s
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-variant'
                )}
              >
                {s === 'all' ? 'Tất cả' : statusLabels[s]?.label || s}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <Table columns={columns} data={data} keyField="id" emptyMessage="Chưa có lịch sử chuyển đổi nào" />
          </div>

          {/* Pagination */}
          <TablePagination currentPage={1} totalPages={3} onPageChange={() => {}} />

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="card p-xl text-center">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-md">folder_off</span>
              <p className="text-headline-md font-headline-md text-on-surface-variant mb-sm">Chưa có lịch sử chuyển đổi nào</p>
              <p className="text-body-md font-body-md text-on-surface-variant mb-lg">Hãy chuyển đổi file PDF đầu tiên của bạn</p>
              <Link href="/upload">
                <Button variant="primary">Chuyển đổi ngay</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
