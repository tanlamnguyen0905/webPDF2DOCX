'use client'

import * as React from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { Camera } from 'lucide-react'

export default function ProfilePage() {
  const [isSaving, setIsSaving] = React.useState(false)
  const [saveSuccess, setSaveSuccess] = React.useState(false)
  const coinBalance = 50

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <MainLayout>
      <div className="container-main page-section">
        <div className="max-w-[600px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-body-sm text-on-surface-variant mb-lg">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-on-surface">Thông tin cá nhân</span>
          </div>

          <div className="card p-xl">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-lg">
              <div className="relative group mb-sm">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-surface shadow-card">
                  <span className="text-headline-lg font-headline-lg text-primary">N</span>
                </div>
                <button
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-overlay hover:bg-primary/90 transition-colors"
                  aria-label="Đổi ảnh đại diện"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <button className="text-label-sm font-label-sm text-primary hover:underline">
                Đổi ảnh đại diện
              </button>
            </div>

            {/* Profile Form */}
            <div className="flex flex-col gap-lg">
              <div className="flex flex-col gap-xs">
                <label className="text-label-md font-label-md text-on-surface" htmlFor="name">
                  Họ tên
                </label>
                <input
                  id="name"
                  type="text"
                  defaultValue="Nguyen Van A"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="text-label-md font-label-md text-on-surface" htmlFor="profile-email">
                  Email
                </label>
                <input
                  id="profile-email"
                  type="email"
                  defaultValue="nguyenvana@email.com"
                  disabled
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-surface-variant cursor-not-allowed"
                />
              </div>

              {/* Coin Balance */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    monetization_on
                  </span>
                  <div>
                    <p className="text-body-md font-body-md text-on-surface">Số dư coin</p>
                    <p className="text-headline-md font-headline-md text-primary">{coinBalance} coin</p>
                  </div>
                </div>
                <Link href="/payment">
                  <Button variant="primary" size="sm">
                    Nạp thêm
                  </Button>
                </Link>
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-md">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSaving}
                  onClick={handleSave}
                >
                  {saveSuccess ? 'Đã lưu!' : 'Lưu thay đổi'}
                </Button>
              </div>

              {/* Success Toast */}
              {saveSuccess && (
                <div className="fixed bottom-6 right-6 z-toast flex items-center gap-3 px-4 py-3 rounded-xl shadow-overlay bg-surface border border-success/30 animate-slide-in">
                  <span className="material-symbols-outlined text-success">check_circle</span>
                  <span className="text-body-sm font-body-sm text-on-surface">Cập nhật thành công</span>
                </div>
              )}

              {/* Links */}
              <div className="border-t border-outline-variant pt-lg mt-sm">
                <Link
                  href="/transactions"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant">receipt_long</span>
                    <span className="text-body-md font-body-md text-on-surface">Lịch sử giao dịch</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">arrow_forward_ios</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
