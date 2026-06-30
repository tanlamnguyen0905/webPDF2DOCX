'use client'

import * as React from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

const transactions = [
  { id: '1', type: 'credit', amount: '+10', balance: 88, desc: 'Đăng ký tài khoản', date: '22/06/2026 10:30' },
  { id: '2', type: 'debit', amount: '-5', balance: 78, desc: 'Convert file document.pdf', date: '22/06/2026 10:35' },
  { id: '3', type: 'refund', amount: '+5', balance: 83, desc: 'Hoàn do lỗi hệ thống', date: '21/06/2026 15:22' },
  { id: '4', type: 'debit', amount: '-15', balance: 68, desc: 'Convert file report_q2.pdf (Nâng cao)', date: '21/06/2026 10:00' },
  { id: '5', type: 'credit', amount: '+50', balance: 83, desc: 'Nạp coin', date: '20/06/2026 09:15' },
]

const typeConfig = {
  credit: { icon: 'add_circle', color: 'text-success', bg: 'bg-success/10', label: 'Cộng' },
  debit: { icon: 'remove_circle', color: 'text-error', bg: 'bg-error/10', label: 'Trừ' },
  refund: { icon: 'replay', color: 'text-warning', bg: 'bg-warning/10', label: 'Hoàn' },
}

export default function TransactionsPage() {
  return (
    <MainLayout>
      <div className="container-main page-section">
        <div className="max-w-[720px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-body-sm text-on-surface-variant mb-lg">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link href="/profile" className="hover:text-primary transition-colors">Profile</Link>
            <span>/</span>
            <span className="text-on-surface">Giao dịch</span>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-xl text-white mb-lg">
            <p className="text-body-md font-body-md text-white/80">Số dư hiện tại</p>
            <p className="text-display font-display text-white mt-sm">50 coin</p>
            <Link href="/payment">
              <button className="mt-md bg-white/20 text-white px-4 py-2 rounded-lg text-label-sm hover:bg-white/30 transition-colors">
                Nạp thêm
              </button>
            </Link>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-lg">
            {['Tất cả', 'Cộng', 'Trừ', 'Hoàn'].map((f) => (
              <button
                key={f}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-label-sm transition-colors',
                  f === 'Tất cả'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-variant'
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Transaction List */}
          <div className="flex flex-col gap-sm">
            {transactions.map((tx) => {
              const config = typeConfig[tx.type as keyof typeof typeConfig]
              return (
                <div key={tx.id} className="card flex items-center gap-lg p-lg">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', config.bg)}>
                    <span className={cn('material-symbols-outlined', config.color)} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {config.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-md font-body-md text-on-surface">{tx.desc}</p>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">{tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-label-md font-label-md', config.color)}>
                      {tx.amount} coin
                    </p>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">
                      Số dư: {tx.balance}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {transactions.length === 0 && (
            <div className="card p-xl text-center">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-md">receipt_long</span>
              <p className="text-body-md font-body-md text-on-surface-variant">Chưa có giao dịch nào</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
