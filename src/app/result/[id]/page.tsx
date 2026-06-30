'use client'

import * as React from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { CheckCircle2, Download, Upload, FileText, Clock } from 'lucide-react'
import { conversionApi, getErrorMessage } from '@/lib/api'
import type { ConversionJobDto } from '@/lib/types'

export default function ResultPage({ params }: { params: { id: string } }) {
  const [job, setJob] = React.useState<ConversionJobDto | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [countdown, setCountdown] = React.useState(3599)
  const [isExpired, setIsExpired] = React.useState(false)

  // Fetch conversion job detail
  React.useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await conversionApi.getById(Number(params.id))
        if (res.success) {
          setJob(res.data as ConversionJobDto)
          // Calculate countdown
          if ((res.data as ConversionJobDto).fileExpiredAt) {
            const expired = new Date((res.data as ConversionJobDto).fileExpiredAt!).getTime()
            const now = Date.now()
            const remaining = Math.max(0, Math.floor((expired - now) / 1000))
            setCountdown(remaining)
            if (remaining <= 0) setIsExpired(true)
          }
          if ((res.data as ConversionJobDto).status === 'EXPIRED') setIsExpired(true)
          if ((res.data as ConversionJobDto).status === 'DELETED') setIsExpired(true)
        } else {
          setError('Không tìm thấy kết quả chuyển đổi.')
        }
      } catch (err) {
        setError(getErrorMessage(err, 'Không thể tải kết quả.'))
      } finally {
        setIsLoading(false)
      }
    }
    fetchJob()
  }, [params.id])

  // Countdown timer
  React.useEffect(() => {
    if (isExpired || !countdown) return
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isExpired, countdown])

  const handleDownload = async () => {
    if (!job || !job.downloadAvailable) return
    setIsDownloading(true)
    try {
      // Try to get download URL first, then redirect
      const urlRes = await conversionApi.downloadUrl(job.id)
      if (urlRes.success && urlRes.data) {
        window.open((urlRes.data as { url: string }).url, '_blank')
      } else {
        // Fallback: direct download via API
        const link = document.createElement('a')
        link.href = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/conversions/${job.id}/download`
        link.setAttribute('download', job.outputFileName || 'document.docx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tải file.'))
    } finally {
      setIsDownloading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container-main page-section">
          <div className="max-w-[600px] mx-auto text-center">
            <div className="card p-xl">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-lg animate-pulse" />
              <div className="h-8 bg-surface-variant rounded-lg w-64 mx-auto mb-lg animate-pulse" />
              <div className="h-16 bg-surface-variant rounded-lg mb-lg animate-pulse" />
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Error state
  if (error || !job) {
    return (
      <MainLayout>
        <div className="container-main page-section">
          <div className="max-w-[600px] mx-auto text-center">
            <div className="card p-xl">
              <p className="text-body-md font-body-md text-error mb-lg">{error || 'Không tìm thấy kết quả.'}</p>
              <Link href="/upload">
                <Button variant="primary">Chuyển đổi file mới</Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container-main page-section">
        <div className="max-w-[600px] mx-auto text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-body-sm text-on-surface-variant mb-lg">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-on-surface">Kết quả</span>
          </div>

          {/* Card */}
          <div className="card p-xl">
            {/* Success Icon */}
            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-lg">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>

            <h1 className="text-headline-lg font-headline-lg text-success mb-lg">
              Chuyển đổi thành công!
            </h1>

            {/* Result File Card */}
            <div className="flex items-center gap-lg p-4 bg-surface-container-low rounded-xl mb-lg text-left">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-md font-body-md text-on-surface truncate">
                  {job.outputFileName || 'document.docx'}
                </p>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  {job.totalPages} trang
                </p>
              </div>
            </div>

            {/* Countdown Timer */}
            {!isExpired && (
              <div className="flex items-center justify-center gap-2 text-body-sm text-on-surface-variant mb-lg">
                <Clock className="w-4 h-4" />
                <span>
                  Có thể tải trong{' '}
                  <strong className={cn('font-label-md', countdown < 300 ? 'text-warning' : 'text-on-surface')}>
                    {formatTime(countdown)}
                  </strong>
                  {job.conversionMode === 'FREE' ? ' (miễn phí)' : ''}
                </span>
              </div>
            )}

            {/* Expired */}
            {isExpired && (
              <div className="p-3 bg-warning/5 border border-warning/30 rounded-lg mb-lg">
                <p className="text-body-sm text-warning">File đã hết hạn tải về</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-md">
              <Button
                variant="success"
                size="lg"
                fullWidth
                disabled={isExpired || !job.downloadAvailable}
                loading={isDownloading}
                onClick={handleDownload}
              >
                <Download className="w-5 h-5" />
                Tải về
              </Button>
              <Link href="/upload" className="w-full">
                <Button variant="secondary" size="lg" fullWidth>
                  <Upload className="w-4 h-4" />
                  Chuyển đổi thêm
                </Button>
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-label-md text-primary hover:underline mt-lg"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}
