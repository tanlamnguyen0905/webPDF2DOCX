'use client'

import * as React from 'react'
import { AdminLayout } from '@/components/layout'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

const kpiCards = [
  { title: 'Tổng người dùng', value: '120', icon: 'group', change: '+12%', positive: true },
  { title: 'Tổng lượt convert', value: '500', icon: 'description', change: '+8%', positive: true },
  { title: 'Doanh thu coin', value: '10,000', icon: 'monetization_on', change: '+15%', positive: true },
  { title: 'Convert hôm nay', value: '25', icon: 'trending_up', change: '+5%', positive: true },
]

const recentUsers = [
  { id: '1', name: 'Nguyen Van A', email: 'nguyenvana@email.com', role: 'USER', coin: 50, status: 'ACTIVE' },
  { id: '2', name: 'Tran Thi B', email: 'tranthib@email.com', role: 'USER', coin: 120, status: 'ACTIVE' },
  { id: '3', name: 'Le Van C', email: 'levanc@email.com', role: 'ADMIN', coin: 500, status: 'ACTIVE' },
  { id: '4', name: 'Pham Thi D', email: 'phamthid@email.com', role: 'USER', coin: 0, status: 'LOCKED' },
  { id: '5', name: 'Hoang Van E', email: 'hoangvane@email.com', role: 'USER', coin: 30, status: 'ACTIVE' },
]

const weeklyData = [45, 52, 38, 65, 42, 58, 70]

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {kpiCards.map((kpi) => (
          <div key={kpi.title} className="card p-lg">
            <div className="flex items-center justify-between mb-sm">
              <span className="text-body-sm font-body-sm text-on-surface-variant">{kpi.title}</span>
              <span className={cn(
                'material-symbols-outlined',
                kpi.positive ? 'text-success' : 'text-on-surface-variant'
              )} style={{ fontVariationSettings: "'FILL' 1" }}>
                {kpi.icon}
              </span>
            </div>
            <p className="text-headline-lg font-headline-lg text-on-surface">{kpi.value}</p>
            <p className={cn(
              'text-body-sm font-body-sm mt-xs',
              kpi.positive ? 'text-success' : 'text-error'
            )}>
              {kpi.change} so với tuần trước
            </p>
          </div>
        ))}
      </div>

      {/* Chart + Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md mt-md">
        {/* Chart */}
        <div className="card p-lg lg:col-span-2">
          <div className="flex items-center justify-between mb-lg">
            <h3 className="text-headline-md font-headline-md text-on-surface">Lượt convert theo ngày</h3>
            <span className="text-body-sm text-on-surface-variant">Tuần này</span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {weeklyData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-primary/80 rounded-t-md transition-all hover:bg-primary"
                  style={{ height: `${(val / 70) * 100}%` }}
                />
                <span className="text-label-sm text-on-surface-variant">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-headline-sm font-headline-sm text-on-surface">User mới nhất</h3>
          </div>
          <div className="divide-y divide-outline-variant/50">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 px-lg py-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-label-sm font-label-sm text-primary shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-body-md text-on-surface truncate">{user.name}</p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant truncate">{user.email}</p>
                </div>
                <Badge variant={user.status === 'ACTIVE' ? 'success' : 'error'}>
                  {user.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
