'use client'

import * as React from 'react'
import { MainLayout } from '@/components/layout'
import { Button, Select } from '@/components/ui'
import { cn } from '@/lib/utils'
import { Headset, Loader2, CheckCircle2 } from 'lucide-react'

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await new Promise((r) => setTimeout(r, 1500))
      setIsSuccess(true)
    } catch {
      setError('Không thể gửi khiếu nại. Vui lòng thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MainLayout>
      <div className="container-main page-section">
        <div className="max-w-[600px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-body-sm text-on-surface-variant mb-lg">
            <span className="hover:text-primary transition-colors cursor-pointer">Trang chủ</span>
            <span>/</span>
            <span className="text-on-surface">Hỗ trợ</span>
          </div>

          <div className="card p-xl">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-lg">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-sm">
                <Headset className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-headline-lg font-headline-lg text-on-surface">Hỗ trợ & Khiếu nại</h1>
              <p className="text-body-md font-body-md text-on-surface-variant">
                Chúng tôi sẽ phản hồi trong vòng 24 giờ
              </p>
            </div>

            {/* Success State */}
            {isSuccess ? (
              <div className="flex flex-col items-center text-center py-lg">
                <CheckCircle2 className="w-16 h-16 text-success mb-md" />
                <h2 className="text-headline-md font-headline-md text-on-surface mb-sm">Khiếu nại đã được gửi!</h2>
                <p className="text-body-md font-body-md text-on-surface-variant">Chúng tôi sẽ phản hồi trong 24h.</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-error/5 border border-error/30 rounded-lg text-error text-body-sm mb-lg">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md font-label-md text-on-surface" htmlFor="subject">
                      Tiêu đề
                    </label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="Tóm tắt vấn đề của bạn"
                      required
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <Select
                    label="Loại vấn đề"
                    id="category"
                    options={[
                      { value: 'convert', label: 'Lỗi convert' },
                      { value: 'coin', label: 'Trừ coin sai' },
                      { value: 'payment', label: 'Lỗi thanh toán' },
                      { value: 'other', label: 'Khác' },
                    ]}
                    placeholder="Chọn loại vấn đề"
                  />

                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md font-label-md text-on-surface" htmlFor="content">
                      Nội dung
                    </label>
                    <textarea
                      id="content"
                      rows={5}
                      placeholder="Mô tả chi tiết vấn đề..."
                      required
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[120px]"
                    />
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md font-label-md text-on-surface" htmlFor="attachment">
                      Đính kèm file
                    </label>
                    <div className="flex items-center gap-3 p-3 border border-dashed border-outline-variant rounded-lg">
                      <input id="attachment" type="file" className="text-body-sm text-on-surface-variant file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:text-label-sm file:font-label-sm file:cursor-pointer hover:file:bg-primary/20" />
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-xs">(Không bắt buộc)</p>
                  </div>

                  <Button variant="primary" size="lg" fullWidth loading={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      'Gửi khiếu nại'
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
