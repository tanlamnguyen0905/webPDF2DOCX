'use client'

import * as React from 'react'
import { AdminLayout } from '@/components/layout'
import { Badge, Table } from '@/components/ui'

const mockPackages = [
  { id: '1', name: 'Gói Cơ bản', price: '10.000 ₫', coins: 10, desc: 'Dùng thử', status: 'ACTIVE' },
  { id: '2', name: 'Gói Phổ biến', price: '50.000 ₫', coins: 55, desc: 'Tiết kiệm 10%', status: 'ACTIVE' },
  { id: '3', name: 'Gói Cao cấp', price: '100.000 ₫', coins: 120, desc: 'Tiết kiệm 20%', status: 'ACTIVE' },
  { id: '4', name: 'Gói VIP', price: '500.000 ₫', coins: 650, desc: 'Tiết kiệm 30%', status: 'ACTIVE' },
  { id: '5', name: 'Gói Cũ', price: '20.000 ₫', coins: 18, desc: '', status: 'INACTIVE' },
]

export default function AdminCoinPackagesPage() {
  const columns = [
    { key: 'stt', header: 'STT' },
    { key: 'name', header: 'Tên gói' },
    { key: 'price', header: 'Giá (VND)' },
    { key: 'coins', header: 'Số coin' },
    { key: 'desc', header: 'Mô tả' },
    { key: 'status', header: 'Trạng thái' },
    { key: 'actions', header: 'Hành động' },
  ]

  const data = mockPackages.map((p, i) => ({
    ...p,
    stt: i + 1,
    status: <Badge variant={p.status === 'ACTIVE' ? 'success' : 'error'}>{p.status}</Badge>,
    actions: (
      <div className="flex gap-2">
        <button className="btn-ghost btn-sm">Sửa</button>
        <button className="btn-ghost btn-sm">{p.status === 'ACTIVE' ? 'Tắt' : 'Bật'}</button>
      </div>
    ),
  }))

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-lg">
        <h2 className="text-headline-md font-headline-md text-on-surface">Quản lý gói coin</h2>
        <button className="btn-primary btn-md">+ Thêm gói mới</button>
      </div>
      <div className="card overflow-hidden">
        <Table columns={columns} data={data} keyField="id" emptyMessage="Chưa có gói coin nào" />
      </div>
    </AdminLayout>
  )
}
