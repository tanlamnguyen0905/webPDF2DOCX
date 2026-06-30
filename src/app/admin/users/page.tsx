'use client'

import * as React from 'react'
import { AdminLayout } from '@/components/layout'
import { Badge, Table } from '@/components/ui'
import { Search } from 'lucide-react'

const mockUsers = [
  { id: '1', email: 'nguyenvana@email.com', name: 'Nguyen Van A', role: 'USER', coin: 50, status: 'ACTIVE' },
  { id: '2', email: 'tranthib@email.com', name: 'Tran Thi B', role: 'USER', coin: 120, status: 'ACTIVE' },
  { id: '3', email: 'levanc@email.com', name: 'Le Van C', role: 'ADMIN', coin: 500, status: 'ACTIVE' },
  { id: '4', email: 'phamthid@email.com', name: 'Pham Thi D', role: 'USER', coin: 0, status: 'LOCKED' },
  { id: '5', email: 'hoangvane@email.com', name: 'Hoang Van E', role: 'USER', coin: 30, status: 'ACTIVE' },
  { id: '6', email: 'nguyenvanf@email.com', name: 'Nguyen Van F', role: 'SUPPORT', coin: 200, status: 'ACTIVE' },
]

const roleBadge: Record<string, 'primary' | 'neutral' | 'success'> = {
  ADMIN: 'primary',
  USER: 'neutral',
  SUPPORT: 'success',
}

export default function AdminUsersPage() {
  const columns = [
    { key: 'stt', header: 'STT' },
    { key: 'email', header: 'Email' },
    { key: 'name', header: 'Tên' },
    { key: 'role', header: 'Role' },
    { key: 'coin', header: 'Số coin' },
    { key: 'status', header: 'Trạng thái' },
    { key: 'actions', header: 'Hành động' },
  ]

  const data = mockUsers.map((u, i) => ({
    ...u,
    stt: i + 1,
    role: <Badge variant={roleBadge[u.role] || 'neutral'}>{u.role}</Badge>,
    status: <Badge variant={u.status === 'ACTIVE' ? 'success' : 'error'}>{u.status}</Badge>,
    actions: (
      <div className="flex gap-2">
        <button className="btn-ghost btn-sm">
          {u.status === 'ACTIVE' ? 'Khóa' : 'Mở'}
        </button>
      </div>
    ),
  }))

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-lg">
        <h2 className="text-headline-md font-headline-md text-on-surface">Quản lý người dùng</h2>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Tìm kiếm theo email hoặc tên"
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <Table columns={columns} data={data} keyField="id" emptyMessage="Không tìm thấy người dùng" />
      </div>
    </AdminLayout>
  )
}
