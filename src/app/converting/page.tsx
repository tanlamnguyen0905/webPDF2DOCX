'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { conversionApi, getErrorMessage } from '@/lib/api'
import type { ConversionStatus as ConversionStatusType, ConversionStatusDto } from '@/lib/types'

type PageState = 'processing' | 'success' | 'error'

export default function ConvertingPage() {
  const router = useRouter()
  const [pageState, setPageState] = React.useState<PageState>('processing')
  const [progress, setProgress] = React.useState(0)
  const [error, setError] = React.useState('')
  const [statusMessage, setStatusMessage] = React.useState('Đang chờ...')
  const [timeLeft, setTimeLeft] = React.useState(60)

  // Get conversion job ID from session
  const conversionJobId = typeof window !== 'undefined' ? sessionStorage.getItem('conversionJobId') : null

  // Redirect if no job ID
  React.useEffect(() => {
    if (!conversionJobId) {
      router.replace('/upload')
    }
  }, [conversionJobId, router])

  // Poll API
  React.useEffect(() => {
    if (!conversionJobId || pageState !== 'processing') return

    let cancelled = false

    const poll = async () => {
      try {
        const res = await conversionApi.getStatus(Number(conversionJobId))
        if (cancelled) return

        if (res.success) {
          const data = res.data as ConversionStatusDto
          setProgress(data.progress ?? 0)
          setStatusMessage(data.message || getStatusText(data.status))

          if (data.status === 'SUCCESS') {
            setPageState('success')
            sessionStorage.setItem('downloadJobId', conversionJobId)
            sessionStorage.removeItem('conversionJobId')
            setTimeout(() => {
              router.push(`/result/${conversionJobId}`)
            }, 1500)
            return
          }

          if (data.status === 'FAILED' || data.status === 'EXPIRED' || data.status === 'DELETED') {
            setPageState('error')
            setError(data.errorMessage || 'Chuyển đổi thất bại.')
            return
          }

          // Continue polling
          setTimeout(poll, 3000)
        } else {
          if (cancelled) return
          setTimeout(poll, 3000)
        }
      } catch (err) {
        if (cancelled) return
        setError(getErrorMessage(err, 'Mất kết nối đến máy chủ. Đang thử lại...'))
        setTimeout(poll, 5000)
      }
    }

    // Start polling after 1 second
    const startTimer = setTimeout(poll, 1000)

    // Countdown timer for UX
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => {
      cancelled = true
      clearTimeout(startTimer)
      clearInterval(timer)
    }
  }, [conversionJobId, pageState, router])

  const handleCancel = async () => {
    if (!conversionJobId) return
    try {
      await conversionApi.cancel(Number(conversionJobId))
    } catch {
      // Silently fail
    }
    setPageState('error')
    setError('Chuyển đổi đã bị hủy.')
  }

  return (
    <MainLayout>
      <div className="container-main page-section">
        <div className="max-w-[480px] mx-auto text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-body-sm text-on-surface-variant mb-lg">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link href="/upload" className="hover:text-primary transition-colors">Upload</Link>
            <span>/</span>
            <span className="text-on-surface">Đang xử lý</span>
          </div>

          {/* Processing State */}
          {pageState === 'processing' && (
            <div className="card p-xl">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-lg">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>

              <h2 className="text-headline-md font-headline-md text-on-surface mb-sm">
                Đang chuyển đổi file...
              </h2>
              <p className="text-body-md font-body-md text-on-surface-variant mb-lg">
                Dự kiến: {timeLeft} giây
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-outline-variant/30 rounded-full h-4 overflow-hidden mb-lg">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-body-sm font-body-sm text-primary mb-lg">{progress}%</p>

              {/* Status */}
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-lg">
                {statusMessage}
              </p>

              {/* Cancel Button */}
              <Button variant="ghost" size="md" onClick={handleCancel}>
                Hủy
              </Button>
            </div>
          )}

          {/* Success State */}
          {pageState === 'success' && (
            <div className="card p-xl">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-lg">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-headline-md font-headline-md text-success mb-sm">
                Chuyển đổi thành công!
              </h2>
              <p className="text-body-md font-body-md text-on-surface-variant">
                Đang chuyển hướng đến kết quả...
              </p>
            </div>
          )}

          {/* Error State */}
          {pageState === 'error' && (
            <div className="card p-xl">
              <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-lg">
                <XCircle className="w-10 h-10 text-error" />
              </div>
              <h2 className="text-headline-md font-headline-md text-error mb-sm">
                Chuyển đổi thất bại
              </h2>
              <p className="text-body-md font-body-md text-on-surface-variant mb-lg">
                {error || 'Có lỗi xảy ra trong quá trình chuyển đổi.'}
              </p>
              <div className="flex flex-col gap-md">
                {conversionJobId && (
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={async () => {
                      try {
                        await conversionApi.retry(Number(conversionJobId), 'NORMAL')
                        sessionStorage.setItem('conversionJobId', conversionJobId)
                        setPageState('processing')
                        setError('')
                        setProgress(0)
                      } catch (err) {
                        setError(getErrorMessage(err, 'Không thể thử lại.'))
                      }
                    }}
                  >
                    Thử lại
                  </Button>
                )}
                <Link href="/upload" className="w-full">
                  <Button variant="ghost" size="md" fullWidth>
                    Chọn file khác
                  </Button>
                </Link>
                <Link href="/support" className="w-full">
                  <Button variant="ghost" size="md" fullWidth>
                    Liên hệ hỗ trợ
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

function getStatusText(status: ConversionStatusType): string {
  switch (status) {
    case 'PENDING': return 'Đang chờ...'
    case 'QUEUED': return 'Đang trong hàng đợi...'
    case 'PROCESSING': return 'Đang chuyển đổi...'
    case 'SUCCESS': return 'Hoàn tất!'
    case 'FAILED': return 'Chuyển đổi thất bại'
    case 'EXPIRED': return 'File đã hết hạn'
    case 'DELETED': return 'File đã bị xóa'
  }
}
