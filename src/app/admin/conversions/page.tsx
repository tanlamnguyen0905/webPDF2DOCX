'use client'

import * as React from 'react'
import { AdminLayout } from '@/components/layout'
import { Badge, Table } from '@/components/ui'

const mockConversions = [
  { id: '1', user: 'Nguyen Van A', pdf: 'document.pdf', docx: 'document.docx', pages: 15, mode: 'FREE', status: 'SUCCESS', date: '22/06/2026 10:30' },
  { id: '2', user: 'Tran Thi B', pdf: 'report.pdf', docx: 'report.docx', pages: 45, mode: 'PREMIUM', status: 'SUCCESS', date: '22/06/2026 09:15' },
  { id: '3', user: 'Le Van C', pdf: 'presentation.pdf', docx: '—', pages: 20, mode: 'FREE', status: 'FAILED', date: '21/06/2026 16:00' },
  { id: '4', user: 'Pham Thi D', pdf: 'contract.pdf', docx: 'contract.docx', pages: 8, mode: 'FREE', status: 'SUCCESS', date: '21/06/2026 14:22' },
  { id: '5', user: 'Hoang Van E', pdf: 'ebook.pdf', docx: '—', pages: 120, mode: 'PREMIUM', status: 'PROCESSING', date: '22/06/2026 11:00' },
]

export default function AdminConversionsPage() {
  const columns = [
    { key: 'stt', header: 'STT' },
    { key: 'user', header: 'User' },
    { key: 'pdf', header: 'File PDF' },
    { key: 'pages', header: 'Trang' },
    { key: 'mode', header: 'Chế độ' },
    { key: 'status', header: 'Trạng thái' },
    { key: 'date', header: 'Thời gian' },
  ]

  const data = mockConversions.map((c, i) => ({
    ...c,
    stt: i + 1,
    mode: <Badge variant={c.mode === 'PREMIUM' ? 'primary' : 'neutral'}>{c.mode}</Badge>,
    status: (
      <Badge
        variant={
          c.status === 'SUCCESS' ? 'success' : c.status === 'FAILED' ? 'error' : 'warning'
        }
      >
        {c.status}
      </Badge>
    ),
  }))

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-lg">
        <h2 className="text-headline-md font-headline-md text-on-surface">Quản lý chuyển đổi</h2>
      </div>
      <div className="card overflow-hidden">
        <Table columns={columns} data={data} keyField="id" emptyMessage="Không có dữ liệu" />
      </div>
    </AdminLayout>
  )
}
