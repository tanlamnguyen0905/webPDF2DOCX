'use client'

import * as React from 'react'
import { AdminLayout } from '@/components/layout'
import { Badge, Table } from '@/components/ui'

const mockTransactions = [
  { id: '1', user: 'Nguyen Van A', coins: '+50', amount: '50.000 ₫', method: 'Manual', status: 'SUCCESS', date: '22/06/2026 10:30' },
  { id: '2', user: 'Tran Thi B', coins: '+120', amount: '100.000 ₫', method: 'Manual', status: 'SUCCESS', date: '21/06/2026 15:22' },
  { id: '3', user: 'Le Van C', coins: '+650', amount: '500.000 ₫', method: 'Manual', status: 'PENDING', date: '20/06/2026 09:15' },
  { id: '4', user: 'Pham Thi D', coins: '-15', amount: '—', method: 'Convert', status: 'SUCCESS', date: '19/06/2026 14:00' },
  { id: '5', user: 'Hoang Van E', coins: '+10', amount: '10.000 ₫', method: 'Manual', status: 'FAILED', date: '18/06/2026 11:45' },
]

const statusVariant: Record<string, 'success' | 'warning' | 'error'> = {
  SUCCESS: 'success',
  PENDING: 'warning',
  FAILED: 'error',
}

export default function AdminTransactionsPage() {
  const columns = [
    { key: 'stt', header: 'STT' },
    { key: 'user', header: 'User' },
    { key: 'coins', header: 'Số coin' },
    { key: 'amount', header: 'Mệnh giá (VND)' },
    { key: 'method', header: 'Phương thức' },
    { key: 'status', header: 'Trạng thái' },
    { key: 'date', header: 'Thời gian' },
  ]

  const data = mockTransactions.map((t, i) => ({
    ...t,
    stt: i + 1,
    status: <Badge variant={statusVariant[t.status] || 'neutral'}>{t.status}</Badge>,
  }))

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-lg">
        <h2 className="text-headline-md font-headline-md text-on-surface">Quản lý giao dịch</h2>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-lg">
        <select className="px-3 py-2 rounded-lg border border-outline-variant bg-surface text-body-sm">
          <option>Tất cả trạng thái</option>
          <option>Pending</option>
          <option>Success</option>
          <option>Failed</option>
        </select>
        <input
          type="date"
          className="px-3 py-2 rounded-lg border border-outline-variant bg-surface text-body-sm"
          placeholder="Từ ngày"
        />
        <input
          type="date"
          className="px-3 py-2 rounded-lg border border-outline-variant bg-surface text-body-sm"
          placeholder="Đến ngày"
        />
      </div>

      <div className="card overflow-hidden">
        <Table columns={columns} data={data} keyField="id" emptyMessage="Không có giao dịch nào" />
      </div>
    </AdminLayout>
  )
}
